const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Blog = require("../models/blog.model")(sequelize, DataTypes);
const Site = require("../models/site.model")(sequelize, DataTypes);
const Cirriculum = require("../models/curriculum.model")(sequelize, DataTypes);
const Comments = require("../models/comment.model")(sequelize, DataTypes);
const Seo = require("../models/seo.model")(sequelize, DataTypes);


class GlobalDataMiddleware {
  static async setBlogFooterList(req, res, next) {
    try {
      const blogFooterList = await Blog.findAll();
      res.locals.blogFooterList = blogFooterList;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  static async setSiteList(req, res, next) {
    try {
      const setSiteList = await Site.findAll();
      res.locals.setSiteList = setSiteList;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  static async setCommentList(req, res, next) {
    try {
      const setCommentList = await Comments.findAll();
      res.locals.setCommentList = setCommentList;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  static async setCirriculumList(req, res, next) {
    try {
      const setCirriculumList = await Cirriculum.findAll();
      res.locals.setCirriculumList = setCirriculumList;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  static async setSeoListByOrder(req, res, next, order) {
    try {
      const seoList = await Seo.findAll({
        order: [['createdAt', 'DESC']]
      });
  
      const selectedSeo = seoList.filter(seo => seo.order === order);
  
      res.locals.selectedSeo = {};
  
      selectedSeo.forEach((seo, index) => {
        res.locals.selectedSeo[`selectedSeo${index + 1}`] = seo;
      });
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = GlobalDataMiddleware;
