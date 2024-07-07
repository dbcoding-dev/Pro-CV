module.exports = (sequelize, DataTypes) => {
    const BlockedIp = sequelize.define(
        "cv_blocked_ip",
        {
            ip_address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return BlockedIp;
};
