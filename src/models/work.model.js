module.exports = (sequelize, DataTypes) => {
    const Work = sequelize.define('cv_work', {
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        worker: {
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
