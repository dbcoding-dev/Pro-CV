module.exports = (sequelize, DataTypes) => {
  const Kvkk = sequelize.define("cv_kvkk",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Kvkk;
};
