exports.ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
};


exports.preventAuthenticatedAccess = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/login');
    }
    next();
};