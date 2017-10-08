'use strict';

import angular from 'angular';
import LoginController from './login.controller';

export default angular.module('meanpc1App.login', [])
  .controller('LoginController', LoginController)
  .name;
