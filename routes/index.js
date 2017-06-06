var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Course = mongoose.model('Course');

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

// Preload comment objects on routes with ':comment'
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
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

// POSTS
// get all posts
router.get('/posts', function (req, res, next) {
	Post.find(function (err, posts) {
		if (err) { return next(err); }

		res.json(posts);
	});
});

// save a post
router.post('/posts', auth, function (req, res, next) {
	var post = new Post(req.body);
	post.author = req.payload.username;

	post.save(function (err, post) {
		if (err) { return next(err); }

		res.json(post);
	});
});


// return a post
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});


// upvote a post
router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
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

// save a course
router.post('/courses', auth, function (req, res, next) {
	var course = new Course(req.body);
	course.author = req.payload.username;

	course.save(function (err, course) {
		if (err) { return next(err); }

		res.json(course);
	});
});

// return a course
router.get('/courses/:course', function (req, res, next) {
	req.course.populate('comments', function (err, course) {
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

// COMMENTS
// create a new comment
router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});


// upvote a comment
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
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

	user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

	  return res.json({ token: user.generateJWT() });
  });
});

module.exports = router;