module.exports = (sequelize, DataTypes) => {
    const Cv_referance = sequelize.define("cv_referance", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cvId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cv_pdfcv',
                key: 'id'
            },
            onDelete: 'CASCADE',
        }
    }, {
        freezeTableName: true,
    });

    Cv_referance.associate = (models) => {
        Cv_referance.belongsTo(models.cv_pdfcv, {
            foreignKey: 'cvId',
            onDelete: 'CASCADE',
        });
    };

    return Cv_referance;
};
