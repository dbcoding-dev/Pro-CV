module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('cv_pdfuser', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user',
        },
        permissions: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    });

    User.associate = (models) => {
        User.hasMany(models.cv_pdfcv, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };
    return User;
};
