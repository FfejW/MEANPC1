'use strict';

/* globals describe, expect, it, before, after, beforeEach, afterEach */

import app from '../..';
import User from './user.model';
import request from 'supertest';

describe('User API:', function() {
  var user;

  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    });
  });

  // Clear users after testing
  after(function() {
    return User.remove();
  });

  describe('GET /api/users/me', function() {
    var token;

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('should respond with a user profile when authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body._id.toString().should.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });

    it('should add a course', function(done) {
      request(app)
        .put('/api/users/' + user._id + '/courses')
        .set('authorization', `Bearer ${token}`)
        .send({
          _id: '599b4ee666840b1b3f1ccbad',
        })
        .expect(204)
        .end((err, res) => {
          done();
        });
    });

    it('should update bio', function(done) {
      request(app)
        .put('/api/users/me')
        .set('authorization', `Bearer ${token}`)
        .send({
          bio: 'this is my bio',
          displayname: 'mynewname',
        })
        .expect(200)
        .end((err, res) => {
          console.log(res.body);
          done();
        });
    });

  });
});
