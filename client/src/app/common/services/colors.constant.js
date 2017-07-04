(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .constant('COLORS', {
      project          : '#c23e00',
      object           : '#ff671f',
      silo             : '#689db0',
      heater           : '#90b7c5',
      partialAvailable : '#ffc000', // yellow
      available        : 'green'    // green
    });
})();
