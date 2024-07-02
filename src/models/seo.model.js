module.exports = (sequelize, DataTypes) => {
    const Seo = sequelize.define("cv_seo",
        {
            order: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            desc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return Seo;
};
