module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('cv_payment', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stripeSessionId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subscriptionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        paymentType: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.cv_pdfuser, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };

    return Payment;
};
