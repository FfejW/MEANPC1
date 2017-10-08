'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('certifications', {
      url: '/certifications',
      template: '<certifications></certifications>'
    });
}
