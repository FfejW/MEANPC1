'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var certificationCtrlStub = {
  index: 'certificationCtrl.index',
  show: 'certificationCtrl.show',
  create: 'certificationCtrl.create',
  upsert: 'certificationCtrl.upsert',
  patch: 'certificationCtrl.patch',
  destroy: 'certificationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var certificationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './certification.controller': certificationCtrlStub
});

describe('Certification API Router:', function() {
  it('should return an express router instance', function() {
    certificationIndex.should.equal(routerStub);
  });

  describe('GET /api/certifications', function() {
    it('should route to certification.controller.index', function() {
      routerStub.get
        .withArgs('/', 'certificationCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/certifications/:id', function() {
    it('should route to certification.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'certificationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/certifications', function() {
    it('should route to certification.controller.create', function() {
      routerStub.post
        .withArgs('/', 'certificationCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/certifications/:id', function() {
    it('should route to certification.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'certificationCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/certifications/:id', function() {
    it('should route to certification.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'certificationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/certifications/:id', function() {
    it('should route to certification.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'certificationCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
