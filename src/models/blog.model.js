const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("cv_blog",
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      detail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      freezeTableName: true,
      hooks: {
        beforeValidate: (blog, options) => {
          if (blog.title) {
            blog.slug = slugify(blog.title, { lower: true });
          }
        },
      },
    }
  );

  return Blog;
};
