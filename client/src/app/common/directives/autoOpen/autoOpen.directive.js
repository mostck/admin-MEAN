(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('autoOpen', autoOpen);

  autoOpen.$inject = ['$parse', '$timeout'];

  /* @ngInject */
  function autoOpen($parse, $timeout) {
    // Usage:
    // <input  uib-datepicker-popup auto-open>
    return {
      link: function(scope, iElement, iAttrs) {
        var isolatedScope = iElement.isolateScope();
        iElement.on("click", function() {
          $timeout(function() {
            $parse("isOpen").assign(isolatedScope, "true");
          });
        });
      }
    };
  }
})();