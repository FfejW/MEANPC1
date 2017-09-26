'use strict';

describe('Component: CoursesComponent', function() {
  // load the controller's module
  beforeEach(module('meanpc1App.courses'));

  var CoursesComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CoursesComponent = $componentController('courses', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
