// models/subscriptionRequest.model.js
module.exports = (sequelize, DataTypes) => {
    const SubscriptionRequest = sequelize.define('cv_subscriptionrequest', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending',
        },
    });

    return SubscriptionRequest;
};
