'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './certifications.routes';

export class CertificationsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
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
