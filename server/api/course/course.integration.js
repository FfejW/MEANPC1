'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCourse;

describe('Course API:', function() {
  describe('GET /api/courses', function() {
    var courses;

    beforeEach(function(done) {
      request(app)
        .get('/api/courses')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          courses = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      courses.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/courses', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/courses')
        .send({
          name: 'New Course',
          info: 'This is the brand new course!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCourse = res.body;
          done();
        });
    });

    it('should respond with the newly created course', function() {
      newCourse.name.should.equal('New Course');
      newCourse.info.should.equal('This is the brand new course!!!');
    });
  });

  describe('GET /api/courses/:id', function() {
    var course;

    beforeEach(function(done) {
      request(app)
        .get(`/api/courses/${newCourse._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          course = res.body;
          done();
        });
    });

    afterEach(function() {
      course = {};
    });

    it('should respond with the requested course', function() {
      course.name.should.equal('New Course');
      course.info.should.equal('This is the brand new course!!!');
    });
  });

  describe('PUT /api/courses/:id', function() {
    var updatedCourse;

    beforeEach(function(done) {
      request(app)
        .put(`/api/courses/${newCourse._id}`)
        .send({
          name: 'Updated Course',
          info: 'This is the updated course!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCourse = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCourse = {};
    });

    it('should respond with the updated course', function() {
      updatedCourse.name.should.equal('Updated Course');
      updatedCourse.info.should.equal('This is the updated course!!!');
    });

    it('should respond with the updated course on a subsequent GET', function(done) {
      request(app)
        .get(`/api/courses/${newCourse._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let course = res.body;

          course.name.should.equal('Updated Course');
          course.info.should.equal('This is the updated course!!!');

          done();
        });
    });
  });

  describe('PATCH /api/courses/:id', function() {
    var patchedCourse;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/courses/${newCourse._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Course' },
          { op: 'replace', path: '/info', value: 'This is the patched course!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCourse = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCourse = {};
    });

    it('should respond with the patched course', function() {
      patchedCourse.name.should.equal('Patched Course');
      patchedCourse.info.should.equal('This is the patched course!!!');
    });
  });

  describe('DELETE /api/courses/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/courses/${newCourse._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when course does not exist', function(done) {
      request(app)
        .delete(`/api/courses/${newCourse._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
