module.exports = (sequelize, DataTypes) => {
    const PageVisit = sequelize.define(
        "cv_page_visit",
        {
            ip_address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            entry_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            exit_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return PageVisit;
};
