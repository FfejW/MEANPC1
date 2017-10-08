'use strict';

import angular from 'angular';
import SignupController from './signup.controller';

export default angular.module('meanpc1App.signup', [])
  .controller('SignupController', SignupController)
  .name;
