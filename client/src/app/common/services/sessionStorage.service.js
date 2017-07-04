(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('sessionStorageService', sessionStorageService);

  sessionStorageService.$inject = [];

  /* @ngInject */
  function sessionStorageService() {
    var service = {
      set: set,
      get: get
    };
    return service;
    ////////////////
    function set(key, value) {
      sessionStorage.setItem( key, JSON.stringify(value) );
    }

    function get(key) {
      return JSON.parse( sessionStorage.getItem(key) );
    }
  }
})();