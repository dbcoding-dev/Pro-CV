const csrf = require('csrf');
const tokens = new csrf();

const csrfSecret = 'dashboard';  // Bu anahtarı güvenli bir şekilde saklayın

function generateCsrfToken(req, res, next) {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        return next();
    }

    let token = req.cookies._csrf;
    if (!token) {
        token = tokens.create(csrfSecret);
        res.cookie('_csrf', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        console.log('Yeni CSRF token oluşturuldu ve ayarlandı:', token);
    } else {
        console.log('Mevcut CSRF token bulundu:', token);
    }
    res.locals.csrfToken = token;
    next();
}

function verifyCsrfToken(req, res, next) {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        return next();
    }

    const token = req.cookies._csrf;
    const formToken = req.body._csrf || req.query._csrf;
    console.log('CSRF token doğrulanıyor:', token);
    console.log('Formdan/gelen CSRF token:', formToken);

    if (!token || !tokens.verify(csrfSecret, token) || token !== formToken) {
        console.error('Geçersiz CSRF token:', token);
        return res.status(403).send('Geçersiz CSRF token');
    }

    next();
}

function setCsrfTokenInLocals(req, res, next) {
    res.locals.csrfToken = req.cookies._csrf;
    next();
}

module.exports = {
    generateCsrfToken,
    verifyCsrfToken,
    setCsrfTokenInLocals
};
