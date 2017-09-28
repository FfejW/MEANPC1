'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './profile.routes';

export class ProfileComponent {
  /*@ngInject*/
  constructor($http, $scope, Auth) {
    this.$http = $http;
    this.auth = Auth;

    this.user = Auth.getCurrentUserSync();
    this.isEditMode = false;
    this.courses = [];
    this.certifications = [];
  }

  $onInit() {
    this.$http.get('/api/users/me')
      .then(response => {
        console.log(response.data);
      });
  }

  editUser() {
    this.auth.update({
      username: this.user.username,
      displayname: this.user.displayname,
      bio: this.user.bio
    });

    $scope.orignalUser = user;
  }
  isLoggedIn() {
  }
  print(course) {
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
