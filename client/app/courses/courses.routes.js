'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('courses', {
      url: '/courses',
      template: '<courses></courses>'
    });
}
