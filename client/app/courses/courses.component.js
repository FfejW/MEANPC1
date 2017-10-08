'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './courses.routes';

export class CoursesComponent {
  courses = [];
  certificaitons = [];
  selectedCertification = {};
  newCourse = '';
  courseIdEdit = '';
  courseTitleEdit = '';
  courseDescriptionEdit = '';
  courseCredits = '';
  courseCreditsEdit = '';

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.auth = Auth;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('course');
    });
  }

  $onInit() {
    this.$http.get('/api/courses')
      .then(response => {
        this.courses = response.data;
        this.socket.syncUpdates('course', this.courses);
      });
    this.$http.get('/api/certifications')
      .then(response => {
        this.certifications = response.data;
      });
  }

  addCourse() {
    if(this.courseTitle === '') {
      return;
    }
    this.$http.post('/api/courses', {
      title: this.courseTitle,
      description: this.courseDescription,
      credits: this.courseCredits,
      certification: this.selectedCertification,
      author: this.auth.getCurrentUserSync()._id,
    }).then(response => {
      this.courseTitle = '';
      this.courseDescription = '';
      this.courseCredits = '';
    });
  }

  deleteCourse(course) {
    this.$http.delete(`/api/courses/${course._id}`);
  }

  addCourseToUser(course) {
    if(this.auth.isLoggedInSync()) {
      return this.$http.put('/api/users/' + this.auth.getCurrentUserSync()._id + '/courses', course, {
        headers: { Authorization: 'Bearer ' + this.auth.getToken() }
      });
    }
  }

  canEditCourses() {
    var token = this.auth.getToken();

    if(token && this.auth.hasRoleSync('Professional')) {
      return true;
    } else {
      return false;
    }
  }

  getCourseForEdit(course) {
    this.courseIdEdit = course._id;
    this.courseTitleEdit = course.title;
    this.courseDescriptionEdit = course.description;
    this.courseCreditsEdit = course.credits;
    this.showEdit = true;
  }

  isEditable(course) {
    var token = this.auth.getToken();
    return token && this.auth.getCurrentUserSync()._id === course.author._id;
  }

  isLoggedIn() {
    return this.auth.isLoggedInSync();
  }

  removeCourse(course) {
    return this.$http.delete('/api/courses/' + course._id)
      .then(function() {
      });
  }

  editCourse() {
    var that = this;
    this.$http.put('/api/courses/' + this.courseIdEdit, {
      description: this.courseDescriptionEdit
    }, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken()
      }
    }).then(function(data) {
      var updatedCourse = that.courses.find(function(course) {
        return course._id === data.data._id;
      });

      updatedCourse.description = that.courseDescriptionEdit;
      that.courseTitleEdit = '';
      that.courseDescriptionEdit = '';
      that.courseCreditsEdit = '';
    });
  }

}

export default angular.module('meanpc1App.courses', [uiRouter])
  .config(routes)
  .component('courses', {
    template: require('./courses.html'),
    controller: CoursesComponent,
    controllerAs: 'coursesCtrl'
  })
  .name;
