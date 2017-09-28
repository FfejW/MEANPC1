'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newPost;

describe('Post API:', function() {
  describe('GET /api/posts', function() {
    var posts;

    beforeEach(function(done) {
      request(app)
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          posts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      posts.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/posts', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/posts')
        .send({
          title: 'New Post',
          author: '599e0e8d7f6d1e6c45769a63'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPost = res.body;
          done();
        });
    });

    it('should respond with the newly created post', function() {
      newPost.title.should.equal('New Post');
      newPost.author.should.equal('599e0e8d7f6d1e6c45769a63');
    });
  });

  describe('GET /api/posts/:id', function() {
    var post;

    beforeEach(function(done) {
      request(app)
        .get(`/api/posts/${newPost._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          post = res.body;
          done();
        });
    });

    afterEach(function() {
      post = {};
    });

    it('should respond with the requested post', function() {
      post.title.should.equal('New Post');
      post.author.should.equal('599e0e8d7f6d1e6c45769a63');
    });
  });

  describe('PUT /api/posts/:id', function() {
    var updatedPost;

    beforeEach(function(done) {
      request(app)
        .put(`/api/posts/${newPost._id}`)
        .send({
          title: 'Updated Post',
          author: '599e0e8d7f6d1e6c45769a63'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPost = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPost = {};
    });

    it('should respond with the updated post', function() {
      updatedPost.title.should.equal('Updated Post');
      updatedPost.author.should.equal('599e0e8d7f6d1e6c45769a63');
    });

    it('should respond with the updated post on a subsequent GET', function(done) {
      request(app)
        .get(`/api/posts/${newPost._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let post = res.body;

          post.title.should.equal('Updated Post');
          post.author.should.equal('599e0e8d7f6d1e6c45769a63');

          done();
        });
    });
  });

  describe('PATCH /api/posts/:id', function() {
    var patchedPost;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/posts/${newPost._id}`)
        .send([
          { op: 'replace', path: '/title', value: 'Patched Post' },
          { op: 'replace', path: '/author', value: '599e0e8d7f6d1e6c45769a63' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPost = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPost = {};
    });

    it('should respond with the patched post', function() {
      patchedPost.title.should.equal('Patched Post');
      patchedPost.author.should.equal('599e0e8d7f6d1e6c45769a63');
    });
  });

  describe('DELETE /api/posts/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/posts/${newPost._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when post does not exist', function(done) {
      request(app)
        .delete(`/api/posts/${newPost._id}`)
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
