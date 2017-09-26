'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCertification;

describe('Certification API:', function() {
  describe('GET /api/certifications', function() {
    var certifications;

    beforeEach(function(done) {
      request(app)
        .get('/api/certifications')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          certifications = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      certifications.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/certifications', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/certifications')
        .send({
          title: 'New Certification',
          description: 'This is the brand new certification!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCertification = res.body;
          done();
        });
    });

    it('should respond with the newly created certification', function() {
      newCertification.title.should.equal('New Certification');
      newCertification.description.should.equal('This is the brand new certification!!!');
    });
  });

  describe('GET /api/certifications/:id', function() {
    var certification;

    beforeEach(function(done) {
      request(app)
        .get(`/api/certifications/${newCertification._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          certification = res.body;
          done();
        });
    });

    afterEach(function() {
      certification = {};
    });

    it('should respond with the requested certification', function() {
      certification.title.should.equal('New Certification');
      certification.description.should.equal('This is the brand new certification!!!');
    });
  });

  describe('PUT /api/certifications/:id', function() {
    var updatedCertification;

    beforeEach(function(done) {
      request(app)
        .put(`/api/certifications/${newCertification._id}`)
        .send({
          title: 'Updated Certification',
          description: 'This is the updated certification!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCertification = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCertification = {};
    });

    it('should respond with the updated certification', function() {
      updatedCertification.title.should.equal('Updated Certification');
      updatedCertification.description.should.equal('This is the updated certification!!!');
    });

    it('should respond with the updated certification on a subsequent GET', function(done) {
      request(app)
        .get(`/api/certifications/${newCertification._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let certification = res.body;

          certification.title.should.equal('Updated Certification');
          certification.description.should.equal('This is the updated certification!!!');

          done();
        });
    });
  });

  describe('PATCH /api/certifications/:id', function() {
    var patchedCertification;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/certifications/${newCertification._id}`)
        .send([
          { op: 'replace', path: '/title', value: 'Patched Certification' },
          { op: 'replace', path: '/description', value: 'This is the patched certification!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCertification = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCertification = {};
    });

    it('should respond with the patched certification', function() {
      patchedCertification.title.should.equal('Patched Certification');
      patchedCertification.description.should.equal('This is the patched certification!!!');
    });
  });

  describe('DELETE /api/certifications/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/certifications/${newCertification._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when certification does not exist', function(done) {
      request(app)
        .delete(`/api/certifications/${newCertification._id}`)
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
