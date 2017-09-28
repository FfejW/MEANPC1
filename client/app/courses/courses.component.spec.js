'use strict';

import courses from './courses.component';
import {
  CoursesController
} from './courses.component';

describe('Component: CoursesComponent', function() {
  beforeEach(angular.mock.module(courses));
  beforeEach(angular.mock.module('stateMock'));
  beforeEach(angular.mock.module('socketMock'));

  var scope;
  var coursesComponent;
  var state;
  var $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $http, $componentController, $rootScope, $state, socket, Auth) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/courses')
      .respond(['Course 1', 'Course 4', 'Course 3', 'Course 4']);

    scope = $rootScope.$new();
    state = $state;
    coursesComponent = $componentController('courses', {
      $http,
      $scope: scope,
      socket,
      Auth,
    });
  }));

  it('should attach a list of courses to the controller', function() {
    coursesComponent.$onInit();
    $httpBackend.flush();
    coursesComponent.courses.length.should.equal(4);
  });
});
