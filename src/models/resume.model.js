module.exports = (sequelize, DataTypes) => {
  const Resume = sequelize.define("cv_resume",
    {
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pdf: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
    }
  );
  return Resume;
};
