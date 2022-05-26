module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated && req.isAuthenticated()) {
            return next();
        }
        console.log('Please log in');
        res.redirect('/api/user/login');
    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
          return next();
        }
        res.redirect('/api/user/me');      
    }
}