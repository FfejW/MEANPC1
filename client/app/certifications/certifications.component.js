'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './certifications.routes';

export class CertificationsComponent {
  certifications = [];
  newCertification = '';
  certificationIdEdit = '';
  certificationTitleEdit = '';
  certificationDescriptionEdit = '';

  /*@ngInject*/
  constructor($http, $scope, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.auth = Auth;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('certification');
    });
  }

  $onInit() {
    this.$http.get('/api/certifications')
      .then(response => {
        this.certifications = response.data;
        this.socket.syncUpdates('certification', this.certifications);
      });
  }

  addCertification() {
    if(this.certificationTitle === '') {
      return;
    }
    this.$http.post('/api/certifications', {
      title: this.certificationTitle,
      description: this.certificationDescription,
      author: this.auth.getCurrentUserSync()._id,
    }).then(response => {
      this.certificationTitle = '';
      this.certificationDescription = '';
    });
  }

  deleteCertification(certification) {
    this.$http.delete(`/api/certifications/${certification._id}`);
  }

  addCertificationToUser(certification) {
    if(this.auth.isLoggedInSync()) {
      return this.$http.put('/api/users/' + this.auth.getCurrentUserSync()._id + '/certifications', certification, {
        headers: { Authorization: 'Bearer ' + this.auth.getToken() }
      });
    }
  }

  canEditCertifications() {
    var token = this.auth.getToken();

    if(token && this.auth.hasRoleSync('Professional')) {
      return true;
    } else {
      return false;
    }
  }

  getCertificationForEdit(certification) {
    this.certificationIdEdit = certification._id;
    this.certificationTitleEdit = certification.title;
    this.certificationDescriptionEdit = certification.description;
    this.showEdit = true;
  }

  isEditable(certification) {
    var token = this.auth.getToken();
    return token && this.auth.getCurrentUserSync()._id === certification.author._id;
  }

  isLoggedIn() {
    return this.auth.isLoggedInSync();
  }

  removeCertification(certification) {
    return this.$http.delete('/api/certifications/' + certification._id)
      .then(function() {
      });
  }

  editCertification() {
    var that = this;
    this.$http.put('/api/certifications/' + this.certificationIdEdit, {
      description: this.certificationDescriptionEdit
    }, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken()
      }
    }).then(function(data) {
      var updatedCertification = that.certifications.find(function(certification) {
        return certification._id === data.data._id;
      });

      updatedCertification.description = that.certificationDescriptionEdit;
      that.certificationTitleEdit = '';
      that.certificationDescriptionEdit = '';
    });
  }

}

export default angular.module('meanpc1App.certifications', [uiRouter])
  .config(routes)
  .component('certifications', {
    template: require('./certifications.html'),
    controller: CertificationsComponent,
    controllerAs: 'certificationsCtrl'
  })
  .name;
