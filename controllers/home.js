var mongoose = require('mongoose');
var User = mongoose.model('User');

const userParam = function (req, res, next, id) {
    var query = User.findById(id);
    
    query.exec(function (err, user) {
        if (err) { return next(err); }
        if (!user) { return next(new Error("can't find user")); }
        
        req.user = user;
        return next();
    });
}

const usernameParam = function (req, res, next, username) {
    var query = User.findOne({ username: username });
    
    query.exec(function (err, user) {
        if (err) { return next(err); }
        if (!user) { return next(new Error("can't find user")); }
        
        req.user = user;
        return next();
    });
}

const getUser = function (req, res, next) {
    req.user.populate('courses', function (err, user) {
        user.populate('certifications', function (err, user) {
            return res.json(user.toProfile());
        });
    });
}

const updateUser = function (req, res, next) {
    req.user.bio = req.body.bio;
    req.user.displayname = req.body.displayname;
    
    req.user.save(function (err, user) {
        if (err) { return next(err); }
        res.json(user.toProfile());
    });
}

module.exports = {
    usernameParam : usernameParam,
    userParam : userParam,
    getUser : getUser,
    updateUser : updateUser
};