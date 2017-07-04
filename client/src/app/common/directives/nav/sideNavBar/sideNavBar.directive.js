(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('sideNavBar', sideNavBar);

  function sideNavBar() {
    return {
      restrict: 'E',
      scope: {
        items: "="
      },
      templateUrl: 'app/common/directives/nav/sideNavBar/sideNavBar.html',
      link: function (scope) {
      }
    };
  }
})();