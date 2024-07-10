module.exports = (sequelize, DataTypes) => {
    const Cv_pdfcv = sequelize.define("cv_pdfcv", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        eposta: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        posta: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        site: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        about: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birth: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        asker: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        surucu: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        medeni: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        freezeTableName: true,
    });

    Cv_pdfcv.associate = (models) => {
        Cv_pdfcv.belongsTo(models.cv_pdfuser, {
            foreignKey: {
                name: 'userId',
                allowNull: false
            },
            onDelete: 'RESTRICT',
        });
        Cv_pdfcv.hasMany(models.cv_academi, { foreignKey: 'cvId', onDelete: 'CASCADE' });
        Cv_pdfcv.hasMany(models.cv_work, { foreignKey: 'cvId', onDelete: 'CASCADE' });
        Cv_pdfcv.hasMany(models.cv_lang, { foreignKey: 'cvId', onDelete: 'CASCADE' });
        Cv_pdfcv.hasMany(models.cv_referance, { foreignKey: 'cvId', onDelete: 'CASCADE' });
        Cv_pdfcv.hasMany(models.cv_skill, { foreignKey: 'cvId', onDelete: 'CASCADE' });
    };

    return Cv_pdfcv;
};
