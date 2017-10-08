'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('meanpc1App.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
