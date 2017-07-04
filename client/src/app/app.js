(function() {
  'use strict';
  angular
    .module('heaterSiloM2M', [
      'ui.bootstrap',
      'ngMaterial',
      'md.data.table',
      'pascalprecht.translate',
      'ngCookies',
      'ngFileUpload',
      'ngSanitize',
      'ngCsv',
      'googlechart',
      'LocalStorageModule',
      'ngMessages',
      'ngDrag',
      'gantt',
      'gantt.table',
      'gantt.movable',
      'gantt.sortable',
      'gantt.tooltips',
      'gantt.groups',
      'gantt.tree',
      'gantt.bounds',
      'gantt.drawtask',
      'uuid',
      // app modules
      'heaterSiloM2M.routing',
      // 'heaterSiloM2M.config'
    ]);
})();