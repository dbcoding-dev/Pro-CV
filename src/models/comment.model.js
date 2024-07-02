module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("cv_comment",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            position: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            desc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            img: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return Comments;
};
