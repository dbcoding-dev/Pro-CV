const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Blog = require("../models/blog.model")(sequelize, DataTypes);
const User = require("../models/user.model")(sequelize, DataTypes);
const UserPdf = require("../models/pdfuser.model")(sequelize, DataTypes);
const bcrypt = require("bcrypt");



class AdminController {
    static async getPanel(req, res) {
        const totalBlog = await Blog.count();
        const totalUser = await UserPdf.count();
        const totalPanelUsers = await User.count();
        res.render("panel/index", {
            totalBlog: totalBlog,
            totalUser: totalUser,
            totalPanelUsers: totalPanelUsers
        })
    }
    static getBlog(req, res) {
        res.render("panel/blog/get")
    }
    static getAdminBlogEkle(req, res) {
        res.render("panel/blog/add");
    }
}

class AuthController {
    static getLogin(req, res) {
        res.render("auth/login")
    }
    static async LoginUser(req, res) {
        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({
                where: {
                    email: email,
                },
            });
            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                res.locals.error = 'Invalid email or password';
                return res.status(401).render('auth/login');
            }

            req.session.panelusers = existingUser;

            if (existingUser.role === 'admin') {
                return res.redirect('/panel');
            } else {
                return res.redirect('/panel');
            }
        } catch (error) {
            console.error(error);
            res.status(500).render('auth/login');
        }
    }
    static async LogoutUser(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.redirect('/panel/login');
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async RegisterUser(req, res) {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({
                where: {
                    email: email,
                },
            });

            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
            });
            res.redirect('/panel/users');

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async getRegisterUser(req, res) {
        res.render("panel/panelusers/add")
    }
    static async getPanelUsers(req, res) {
        try {
            const users = await User.findAll();
            res.render('panel/panelusers/get', { userList: users });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async deleteUser(req, res) {
        try {
            const userToDelete = await User.findByPk(req.params.id);

            if (!userToDelete) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            await userToDelete.destroy();
            res.json({ success: true, message: 'Deleted Successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    static async updateUser(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).send('User not found');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await user.update({
                name: name,
                email: email,
                password: hashedPassword,
            });
            req.flash('success', 'User updated successfully');
            res.redirect('/panel/users');
        } catch (error) {
            console.error(error);
            req.flash('error', 'An error occurred: ' + error.message);
            res.redirect('/panel/users');
        }
    }
    static async getUpdate(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.render('panel/panelusers/edit', { user: user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

}




module.exports = {
    AdminController,
    AuthController,
}