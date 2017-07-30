var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var passport = require('passport');
var homeController = require('../controllers/home.js')
var coursesController = require('../controllers/courses.js')
var certificationsController = require('../controllers/certifications.js')
var authController = require('../controllers/auth.js')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Certifi Home' });
});
//does the above even work anymore

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

// USERS

// Preload user objects on routes with ':user'
router.param('user', homeController.userParam);

// Preload user objects on routes with ':username'
router.param('username', homeController.usernameParam);
router.get('/users/:username', homeController.getUser);
router.put('/users/:username', auth, homeController.updateUser);

// COURSES

// Preload course objects on routes with ':course'
router.param('course', coursesController.courseParam);
router.get('/courses', coursesController.getCourses);
router.get('/courses/:course', coursesController.getCourse);
router.post('/courses', auth, coursesController.addCourse);
router.put('/courses/:course', auth, coursesController.updateCourse);
router.delete('/courses/:course', coursesController.deleteCourse);
router.post('/users/:user/courses', auth, coursesController.addCourseToUser);

// CERTIFICATIONS

// Preload certification objects on routes with ':certification'
router.param('certification', certificationsController.certificationParam);
router.get('/certifications', certificationsController.getCertifications);
router.get('/certifications/:certification', certificationsController.getCertification);
router.post('/certifications', auth, certificationsController.addCertification);
router.put('/certifications/:certification', auth, certificationsController.updateCertification);
router.delete('/certifications/:certification', certificationsController.deleteCertification);
router.post('/users/:user/certifications', auth, certificationsController.addCertificationToUser);

// LOGIN/REGISTER
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
