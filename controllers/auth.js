var mongoose = require('mongoose');
var User = mongoose.model('User');


// LOGIN/REGISTER
const login =  function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }
    
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        
        if (user) {
            return res.json({ token: user.generateJWT() });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
};

const register =  function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }
    
    var user = new User();
    
    user.username = req.body.username;
    user.userType = req.body.userType;
    user.displayname = req.body.username;
    
    user.setPassword(req.body.password);
    
    user.save(function (err) {
        if (err) { return next(err); }
        
        return res.json({ token: user.generateJWT() });
    });
};

module.exports = {
    login : login,
    register : register
};