exports.loginAuthMiddleware = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/panel');
    }
    next();
};

exports.authMiddleware = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/panel/login');
    }
    next();
  };

