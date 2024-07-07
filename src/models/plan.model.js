module.exports = (sequelize, DataTypes) => {
    const Plan = sequelize.define("cv_plan",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            price: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            interval: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            freezeTableName: true,
        }
    );
    Plan.associate = (models) => {
        Plan.hasMany(models.cv_subscription, {
            foreignKey: 'planId',
            onDelete: 'CASCADE',
        });
    };

    return Plan;
}