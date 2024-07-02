module.exports = (sequelize, DataTypes) => {
    const Cv_lang = sequelize.define("cv_lang", {
        lang: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cvId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cv_pdfcv',
                key: 'id'
            }
        }
    }, {
        freezeTableName: true,
    });

    Cv_lang.associate = (models) => {
        Cv_lang.belongsTo(models.cv_pdfcv, {
            foreignKey: {
                name: 'cvId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
        });
    };

    return Cv_lang;
};
