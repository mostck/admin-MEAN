(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('submenu', submenu);

  submenu.$inject = [];

  /* @ngInject */
  function submenu() {
    var directive = {
      template: `<ul class="nav nav-stacked submenu">
                  <li ng-repeat="item in items" ui-sref-active="active">
                    <a ui-sref="{{ item.sref }}">{{ item.value | translate }}</a>
                  </li>
                </ul>`,
      restrict: 'AE',
      replace: true,
      scope: {
        items: '=',
      }
    };
    return directive;
  }
})();