const authenticateUser = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }
    next();
};

const ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

const preventAuthenticatedAccess = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    next();
};


const sessionId = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.userId = req.session.user.id;
    } else {
        res.locals.userId = null;
    }
    next();
};


module.exports = {
    authenticateUser,
    ensureAuthenticated,
    preventAuthenticatedAccess,
    sessionId
};
