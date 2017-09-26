'use strict';

import angular from 'angular';

export default angular.module('meanpc1App.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
