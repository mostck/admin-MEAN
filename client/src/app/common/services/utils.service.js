(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .service('utils', utils);

  utils.$inject = [];

  /* @ngInject */
  function utils() {
    /* jshint validthis: true */
    this.capitalize = capitalize;
    ////////////////
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
})();