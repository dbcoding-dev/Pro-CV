const csrf = require('csrf');
const tokens = new csrf();

const csrfSecret = 'dashboard';  // Bu anahtarı güvenli bir şekilde saklayın

// CSRF token oluşturma middleware'i
function generateCsrfToken(req, res, next) {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        // Güvenli HTTP yöntemleri için CSRF token oluşturmayı atla
        return next();
    }

    const token = req.cookies._csrf || tokens.create(csrfSecret);
    if (!req.cookies._csrf) {
        res.cookie('_csrf', token);
    }
    res.locals.csrfToken = token;
    next();
}

// CSRF token doğrulama middleware'i
function verifyCsrfToken(req, res, next) {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        // Güvenli HTTP yöntemleri için CSRF token doğrulamayı atla
        return next();
    }

    const token = req.cookies._csrf;
    if (!tokens.verify(csrfSecret, token)) {
        return res.status(403).send('Invalid CSRF token');
    }

    next();
}

// CSRF token'ı şablonlarda kullanılabilir hale getirme middleware'i
function setCsrfTokenInLocals(req, res, next) {
    res.locals.csrfToken = req.cookies._csrf;
    next();
}

module.exports = {
    generateCsrfToken,
    verifyCsrfToken,
    setCsrfTokenInLocals
};
