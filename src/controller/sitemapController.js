const dotenv = require("dotenv");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../models");
const Blog = require("../models/blog.model")(sequelize, DataTypes);


dotenv.config();

class SitemapController {
  static async generateSitemap(req, res) {
    const siteUrl = process.env.SITE_URL;
    const blogs = await Blog.findAll();
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
              <loc>${siteUrl}/</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
            </url>
              <url>
                <loc>${siteUrl}/about</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
              </url>
              <url>
                <loc>${siteUrl}/contact</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
              </url>
              <url>
              <loc>${siteUrl}/blog</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
            </url>
            <url>
            <loc>${siteUrl}/create-cv</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
          </url>
          ${blogs.map(blog => `
          <url>
            <loc>${siteUrl}/blog/${blog.slug}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
          </url>`).join('')}
            </urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemapContent);
  }
}
module.exports = {
  SitemapController,
};
