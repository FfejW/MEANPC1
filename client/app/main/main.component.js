import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  features = [
    {
      title: 'Easy to Learn',
      description: 'Our courses are easy to learn'
    },
    {
      title: 'Priced for you',
      description: 'Only pay if you become certified.'
    },
    {
      title: 'Improve your career',
      description: 'Earning a certification from certifi is a big step forward '
      + 'in achieving your career goals.'
    },
  ];

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
  }

}

export default angular.module('meanpc1App.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
