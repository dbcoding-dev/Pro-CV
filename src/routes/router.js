const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authenticate.js");

// Rota yapılandırmalarını içeren dizi
const routes = [
    { path: '/', router: require("./pagerouter.js") },
    { path: '/', router: require("./auth/adminloginrouter.js"), auth: true },
    { path: '/', router: require("./commentrouter.js"), auth: true },
    { path: '/', router: require("./seorouter.js"), auth: true },
    { path: '/', router: require("./cirrulumrouter.js"), auth: true },
    { path: '/', router: require("./aboutrouter.js"), auth: true },
    { path: '/', router: require("./siterouter.js"), auth: true },
    { path: '/', router: require("./cookierouter.js"), auth: true },
    { path: '/', router: require("./faqrouter.js"), auth: true },
    { path: '/', router: require("./resumerouter.js"), auth: true },
    { path: '/', router: require("./blogrouter.js"), auth: true },
    { path: '/', router: require("./kvkkrouter.js"), auth: true },
    { path: '/', router: require("./contactrouter.js") },
    { path: '/', router: require("./auth/loginrouter.js") },
    { path: '/', router: require("./paymentrouter.js"), auth: true },
    { path: '/', router: require("./iyzicorouter.js"), auth: true },
    { path: '/', router: require("./googlerouter.js"), auth: true },
    { path: '/', router: require("./websiterouter.js"), auth: true }
];

// Rotaları ekleyen döngü
routes.forEach(route => {
    if (route.auth) {
        // Eğer auth true ise, authenticateUser middleware'ini kullan
        router.use(route.path, authenticateUser, route.router);
    } else {
        // Eğer auth yoksa veya false ise, sadece router'ı kullan
        router.use(route.path, route.router);
    }
});

module.exports = router;
