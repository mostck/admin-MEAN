(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .filter('duration', duration);
  function duration() {
    return durationFilter;
    ////////////////
    function durationFilter(input, unit, format) {
      return moment.duration(input, unit).format(format, { trim: false });
    }
  }
})();