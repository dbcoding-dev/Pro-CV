module.exports = (sequelize, DataTypes) => {
    const Iyzico = sequelize.define("cv_iyzico",
        {
            api_key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            secret_key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return Iyzico;
};
