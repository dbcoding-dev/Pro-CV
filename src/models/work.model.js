module.exports = (sequelize, DataTypes) => {
    const Work = sequelize.define('cv_work', {
        position: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        city: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        worker: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        start: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        end: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cvId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'cv_pdfcv',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    });

    Work.associate = (models) => {
        Work.belongsTo(models.cv_pdfcv, {
            foreignKey: 'cvId',
            onDelete: 'CASCADE',
        });
    };

    return Work;
};
