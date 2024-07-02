module.exports = (sequelize, DataTypes) => {
    const Cv_academi = sequelize.define("cv_academi", {
        university: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        program: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        licance: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        end: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
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

    Cv_academi.associate = (models) => {
        Cv_academi.belongsTo(models.cv_pdfcv, {
            foreignKey: 'cvId',
            onDelete: 'CASCADE',
        });
    };

    return Cv_academi;
};
