'use strict';

describe('Component: CertificationsComponent', function() {
  // load the controller's module
  beforeEach(module('meanpc1App.certifications'));

  var CertificationsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CertificationsComponent = $componentController('certifications', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
