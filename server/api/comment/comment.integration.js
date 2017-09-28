'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newComment;

describe('Comment API:', function() {
  describe('GET /api/comments', function() {
    var comments;

    beforeEach(function(done) {
      request(app)
        .get('/api/comments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          comments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      comments.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/comments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/comments')
        .send({
          body: 'New Comment',
          author: '599e0e8d7f6d1e6c45769a63'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newComment = res.body;
          done();
        });
    });

    it('should respond with the newly created comment', function() {
      newComment.body.should.equal('New Comment');
      newComment.author.should.equal('599e0e8d7f6d1e6c45769a63');
    });
  });

  describe('GET /api/comments/:id', function() {
    var comment;

    beforeEach(function(done) {
      request(app)
        .get(`/api/comments/${newComment._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          comment = res.body;
          done();
        });
    });

    afterEach(function() {
      comment = {};
    });

    it('should respond with the requested comment', function() {
      comment.body.should.equal('New Comment');
      comment.author.should.equal('599e0e8d7f6d1e6c45769a63');
    });
  });

  describe('PUT /api/comments/:id', function() {
    var updatedComment;

    beforeEach(function(done) {
      request(app)
        .put(`/api/comments/${newComment._id}`)
        .send({
          body: 'Updated Comment',
          author: '599e0e8d7f6d1e6c45769a63'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedComment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedComment = {};
    });

    it('should respond with the updated comment', function() {
      updatedComment.body.should.equal('Updated Comment');
      updatedComment.author.should.equal('599e0e8d7f6d1e6c45769a63');
    });

    it('should respond with the updated comment on a subsequent GET', function(done) {
      request(app)
        .get(`/api/comments/${newComment._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let comment = res.body;

          comment.body.should.equal('Updated Comment');
          comment.author.should.equal('599e0e8d7f6d1e6c45769a63');

          done();
        });
    });
  });

  describe('PATCH /api/comments/:id', function() {
    var patchedComment;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/comments/${newComment._id}`)
        .send([
          { op: 'replace', path: '/body', value: 'Patched Comment' },
          { op: 'replace', path: '/author', value: '599e0e8d7f6d1e6c45769a63' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedComment = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedComment = {};
    });

    it('should respond with the patched comment', function() {
      patchedComment.body.should.equal('Patched Comment');
      patchedComment.author.should.equal('599e0e8d7f6d1e6c45769a63');
    });
  });

  describe('DELETE /api/comments/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/comments/${newComment._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when comment does not exist', function(done) {
      request(app)
        .delete(`/api/comments/${newComment._id}`)
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
