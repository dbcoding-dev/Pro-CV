const crypto = require('crypto');

module.exports = (req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
        const token = crypto.randomBytes(24).toString('hex');
        res.locals.csrfToken = token;
        console.log(`Generated CSRF Token: ${token}`);
    } else if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const token = req.body._csrf || req.query._csrf || req.headers['csrf-token'];
        console.log(`Received CSRF Token: ${token}`);
        console.log(`Session CSRF Token: ${req.session.csrfToken}`);
        if (!token || token !== req.session.csrfToken) {
            console.log('CSRF token mismatch');
            return res.status(403).send('CSRF token mismatch');
        }
    }
    next();
};
