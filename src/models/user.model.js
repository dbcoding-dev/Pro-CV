module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('cv_user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        },
    }, {
        freezeTableName: true,
    });

    return User;
};
