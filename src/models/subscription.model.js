module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define("cv_subscription",
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'cv_pdfcv',
                    key: 'id'
                },
                onDelete: 'CASCADE',
            },
            planId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'cv_plan',
                    key: 'id'
                },
                onDelete: 'CASCADE',
            },
            referenceCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );

    Subscription.associate = (models) => {
        Subscription.belongsTo(models.cv_pdfcv, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
        Subscription.belongsTo(models.cv_plan, {
            foreignKey: 'planId',
            onDelete: 'CASCADE',
        });
    };

    return Subscription;
};
