module.exports = (sequelize, DataTypes) => {
    const Stripe = sequelize.define("cv_stripe",
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
    return Stripe;
};
