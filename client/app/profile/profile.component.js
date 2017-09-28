'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './profile.routes';

export class ProfileComponent {
  /*@ngInject*/
  constructor($http, $scope, Auth) {
    this.$http = $http;
    this.auth = Auth;

    var user = Auth.getCurrentUserSync();
    this.user = user;
    this.originalUser = JSON.parse(JSON.stringify(user));
    this.isEditMode = false;
    this.courses = [];
    this.certifications = [];
  }

  $onInit() {
    var that = this;
    this.$http.get('/api/users/me')
      .then(response => {
        that.user = response.data;
        that.originalUser = JSON.parse(JSON.stringify(that.user));
      });
  }

  editUser() {
    var that = this;
    this.$http.put('/api/users/me', this.user, {
      headers: { Authorization: 'Bearer ' + this.auth.getToken() }
    }).then(response => {
      that.user = response.data;
      that.originalUser = JSON.parse(JSON.stringify(that.user));
    });
  }
  cancelEdit() {
    this.user = JSON.parse(JSON.stringify(this.originalUser));
    this.isEditMode = false;
  }
  isLoggedIn() {
    return this.auth.isLoggedInSync();
  }
  print(course) {
    console.log('print this course');
  }
}

export default angular.module('meanpc1App.profile', [uiRouter])
  .config(routes)
  .component('profile', {
    template: require('./profile.html'),
    controller: ProfileComponent,
    controllerAs: 'profileCtrl'
  })
  .name;
