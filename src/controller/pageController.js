const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const PageVisit = require("../models/page.model")(sequelize, DataTypes);
const BlockedIp = require("../models/ipblock.model")(sequelize, DataTypes);

class PageController {
    static async blockIp(req, res) {
        try {
            const { ip_address } = req.body;
            await BlockedIp.create({ ip_address });
            res.redirect('/panel/blocks?success=IP address blocked successfully.');
        } catch (error) {
            console.error('Error blocking IP address:', error);
            res.redirect('/panel/blocks?error=Error blocking IP address.');
        }
    }
    static async unblockIp(req, res) {
        try {
            const { ip_address } = req.body;
            await BlockedIp.destroy({ where: { ip_address } });
            res.status(200).send("IP address unblocked successfully.");
        }
        catch (error) {
            console.error('Error unblocking IP address:', error);
            res.status(500).send("Error unblocking IP address.");
        }
    }
    static async getBlockedIps(req, res) {
        try {
            const blockedIps = await BlockedIp.findAll();
            const logs = await PageVisit.findAll();
            const successMessage = req.query.success || null;
            const errorMessage = req.query.error || null;
            res.render("panel/blocks/index", {
                blockedIps: blockedIps,
                successMessage: successMessage,
                errorMessage: errorMessage,
                logs: logs,
            });
        } catch (error) {
            console.error('Error fetching blocked IPs:', error);
            res.status(500).send("Error fetching blocked IPs.");
        }
    }
    static async deleteBlockedIp(req, res) {
        try {
            const { id } = req.params;
            await BlockedIp.destroy({ where: { id } });
            res.redirect("/panel/blocks");
        }
        catch (error) {
            console.error('Error deleting blocked IP:', error);
            res.status(500).send("Error deleting blocked IP.");
        }
    }
    static async checkBlockedIp(req, res, next) {
        try {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const blocked = await BlockedIp.findOne({ where: { ip_address: ip } });

            if (blocked) {
                return res.status(403).send("Access forbidden: Your IP address is blocked.");
            }

            next();
        } catch (error) {
            console.error('Error checking blocked IP:', error);
            next(error);
        }
    }
    static async logEntry(req, res, next) {
        try {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const url = req.originalUrl;
            const entryTime = new Date();

            // Statik dosya taleplerini filtrele
            if (url.match(/\.(css|js|png|jpg|jpeg|gif|ico|map)$/)) {
                return next();
            }
            const pageVisit = await PageVisit.create({
                ip_address: ip,
                entry_time: entryTime,
                url: url,
            });

            req.pageVisitId = pageVisit.id;
            req.entryTime = entryTime;
            next();
        } catch (error) {
            console.error('Error logging page visit entry:', error);
            next(error);
        }
    }

    static async logExit(req, res, next) {
        res.on('finish', async () => {
            try {
                if (!req.pageVisitId) {
                    return;
                }

                // saniye cinsinden süreyi hesapla
                const exitTime = new Date();
                const duration = Math.floor((exitTime - req.entryTime) / 1000);


                await PageVisit.update(
                    {
                        exit_time: exitTime,
                        duration: duration,
                    },
                    {
                        where: {
                            id: req.pageVisitId,
                        },
                    }
                );
            } catch (error) {
                console.error('Error logging page visit exit:', error);
            }
        });

        next();
    }
}

module.exports = { PageController };
