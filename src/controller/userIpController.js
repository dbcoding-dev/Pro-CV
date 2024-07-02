const express = require('express');
const requestIp = require('request-ip');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class RouteHandler {
  constructor() {
    this.router = express.Router();
    this.logDir = path.join(__dirname, '../log');
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.use(requestIp.mw());
    this.router.get('/', this.handleRequest.bind(this));
    this.router.get('/create-cv', this.handleRequest.bind(this));
    this.router.get('/resume-cv', this.handleRequest.bind(this));
    this.router.get('/blog', this.handleRequest.bind(this));
    this.router.get('/blog/:slug', this.handleRequest.bind(this));
    this.router.get("/sitemap.xml", this.handleRequest.bind(this));
    this.router.get("/contact", this.handleRequest.bind(this));
    this.router.get("/cookie", this.handleRequest.bind(this));
    this.router.get("/about", this.handleRequest.bind(this));
    this.router.get("/price", this.handleRequest.bind(this));
    this.router.use(this.zipAndArchiveLogs.bind(this));
  }

  handleRequest(req, res) {
    const ip = req.clientIp;
    const logData = `[${new Date().toISOString()}] - IP: ${ip}\n`;
    fs.appendFile(this.getLogFilePath(), logData, (err) => {
      if (err) {
        console.error('Dosyaya yazma hatası:', err);
      }
    });

    res.render(path.join(__dirname, '..', 'views', 'index.ejs'), { ip });
  }

  zipAndArchiveLogs(req, res, next) {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const logFilePath = this.getLogFilePath();
    const zipFileName = `${formattedDate}_access.log.gz`;
    const zipFilePath = path.join(this.logDir, zipFileName);

    if (!fs.existsSync(logFilePath)) {
      console.log(`Dosya bulunamadı, oluşturuluyor: ${logFilePath}`);
      fs.writeFileSync(logFilePath, ''); 
    }

    const readStream = fs.createReadStream(logFilePath);

    const writeStream = fs.createWriteStream(zipFilePath);
    const zip = zlib.createGzip();

    readStream.pipe(zip).pipe(writeStream);

    writeStream.on('finish', () => {
      fs.unlink(logFilePath, (err) => {
        if (err) {
          console.error('Dosya silme hatası:', err);
        } else {
          console.log('Günlük dosyası silindi.');
        }
      });
    });

    next();
  }

  getLogFilePath() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    return path.join(this.logDir, `${formattedDate}_access.log`);
  }
}

module.exports = new RouteHandler();
