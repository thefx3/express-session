const session = require('express-session');
const passport = require('passport');

//To pass it in every route we want to protect 
module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ msg: 'You are not authorized to view this resource' });
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.username == "FX") {
        return next();
    }
    return res.status(401).json({ msg: 'You are not authorized to view this resource, you are not an admin' });
};
