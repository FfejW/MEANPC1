'use strict';

describe('Component: ProfileComponent', function() {
  // load the controller's module
  beforeEach(module('meanpc1App.profile'));

  var ProfileComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ProfileComponent = $componentController('profile', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
