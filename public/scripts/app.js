"use strict";

var repogramsModule = angular.module('repogramsModule', [
  'repogramsDirectives',
  'repogramsControllers',
  'repogramsServices',
  'ui.bootstrap',
  'ngAnimate',
  'ngSanitize',
  'angular-loading-bar',
  'vr.directives.slider']).config(['$compileProvider', function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|data):/)
}]);
