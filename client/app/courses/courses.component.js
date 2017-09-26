'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './courses.routes';

export class CoursesComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
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
