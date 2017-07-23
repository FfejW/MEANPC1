var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


var mongoose = require('mongoose');
var User = mongoose.model('User');
var Course = mongoose.model('Course');
var Certification = mongoose.model('Certification');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


// Preload post objects on routes with ':post'
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});

// Preload course objects on routes with ':course'
router.param('course', function (req, res, next, id) {
	var query = Course.findById(id);

	query.exec(function (err, course) {
		if (err) { return next(err); }
		if (!course) { return next(new Error("can't find course")); }

		req.course = course;
		return next();
	});
});

// Preload certification objects on routes with ':certification'
router.param('certification', function (req, res, next, id) {
    var query = Certification.findById(id);
    
    query.exec(function (err, certification) {
        if (err) { return next(err); }
        if (!certification) { return next(new Error("can't find certification")); }
        
        req.certification = certification;
        return next();
    });
});

// Preload user objects on routes with ':user'
router.param('user', function (req, res, next, id) {
	var query = User.findById(id);

	query.exec(function (err, user) {
		if (err) { return next(err); }
		if (!user) { return next(new Error("can't find user")); }

		req.user = user;
		return next();
	});
});

// Preload user objects on routes with ':username'
router.param('username', function (req, res, next, username) {
	var query = User.findOne({username: username});

	query.exec(function (err, user) {
		if (err) { return next(err); }
		if (!user) { return next(new Error("can't find user")); }

		req.user = user;
		return next();
	});
});

// USERS
// get a user profile
router.get('/users/:username', function (req, res, next) {
    req.user.populate('courses', function (err, user) {
        user.populate('certifications', function (err, user) {
            return res.json(user.toProfile());
        });
    });
});

router.put('/users/:username', auth, function(req, res, next) {
    req.user.bio = req.body.bio;
    req.user.displayname = req.body.displayname;

	req.user.save(function (err, user){
		if(err) { return next(err);}
		res.json(user.toProfile());
	});
});

// COURSES
// get all courses
router.get('/courses', function (req, res, next) {
	Course.find(function (err, courses) {
		if (err) { return next(err); }

		res.json(courses);
	});
});

// return a course
router.get('/courses/:course', function (req, res, next) {
		res.json(req.course);
});

// save a course
router.post('/courses', auth, function (req, res, next) {
	var course = new Course(req.body);
	course.author = req.payload.username;

	course.save(function (err, course) {
		if (err) { return next(err); }

		res.json(course);
	});
});

// update a course
router.put('/courses/:course', auth, function (req, res, next) {
	req.course.description = req.body.description;

	req.course.save(function (err, course) {
		if (err) { return next(err); }

		res.json(course);
	});
});

// delete a course
router.delete('/courses/:course', function(req, res, next) {
	return req.course.remove()
		.then(function() {
			return res.sendStatus(204);
		});

	//add authentication
});
// add a course to user
router.post('/users/:user/courses', auth, function (req, res, next) {
	var course = new Course(req.body);
	req.user.addCourse(course);
});

// CERTIFICATIONS
// get all certifications
router.get('/certifications', function (req, res, next) {
    Certification.find(function (err, certifications) {
        if (err) { return next(err); }
        
        res.json(certifications);
    });
});

// return a certification
router.get('/certifications/:certification', function (req, res, next) {
    res.json(req.certification);
});

// save a certification
router.post('/certifications', auth, function (req, res, next) {
    var certification = new Certification(req.body);
    certification.author = req.payload.username;
    
    certification.save(function (err, certification) {
        if (err) { return next(err); }
        
        res.json(certification);
    });
});

// update a certification
router.put('/certifications/:certification', auth, function (req, res, next) {
    req.certification.description = req.body.description;
    
    req.certification.save(function (err, certification) {
        if (err) { return next(err); }
        
        res.json(certification);
    });
});

// delete a certification
router.delete('/certifications/:certification', function (req, res, next) {
    return req.certification.remove()
		.then(function () {
        return res.sendStatus(204);
    });

	//add authentication
});
// add a certification to user
router.post('/users/:user/certifications', auth, function (req, res, next) {
    var certification = new Certification(req.body);
    req.user.addCertification(certification);
});

// LOGIN/REGISTER
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;
  user.userType = req.body.userType;
  user.displayname = req.body.username;

	user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

	  return res.json({ token: user.generateJWT() });
  });
});

module.exports = router;
