module.exports = (sequelize, DataTypes) => {
    const Pos = sequelize.define("cv_pos",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            img: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            freezeTableName: true,
        }
    );

    return Pos;
}