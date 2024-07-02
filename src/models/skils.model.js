module.exports = (sequelize, DataTypes) => {
    const Cv_skill = sequelize.define("cv_skill", {
        skills: {
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

    Cv_skill.associate = (models) => {
        Cv_skill.belongsTo(models.cv_pdfcv, {
            foreignKey: {
                name: 'cvId',
                allowNull: false
            },
            onDelete: 'CASCADE',
        });
    };

    return Cv_skill;
};
