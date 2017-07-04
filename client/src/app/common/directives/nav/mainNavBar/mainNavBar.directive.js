(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('mainNavBar', mainNavBar);

  mainNavBar.$inject = ['$state'];

  function mainNavBar($state) {
    return {
      restrict: 'E',
      scope: {
        items: "="
      },
      templateUrl: 'app/common/directives/nav/mainNavBar/mainNavBar.html',
      link: function (scope) {
        scope.$state = $state;
      }
    };
  }
})();
