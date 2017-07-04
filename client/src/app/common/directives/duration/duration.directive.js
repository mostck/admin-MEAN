(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('duration', duration);

  duration.$inject = ['durationFilter'];

  /* @ngInject */
  function duration(durationFilter) {
    var directive = {
      link: link,
      restrict: 'A',
      require: 'ngModel'
    };
    return directive;

    function link(scope, element, attrs, ngModel) {
      let viewValue;

      ngModel.$formatters.push(value => {
        return value && durationFilter(value, 'm', 'HH:mm');
      });

      ngModel.$parsers.push(value => {
        let returnValue;

        if (/^[\d]{0,}\:?[\d]{0,2}$/g.test(value)) {
          viewValue = value;
          returnValue = viewValue;
        } else {
          returnValue = viewValue;
          ngModel.$setViewValue(viewValue);
          ngModel.$render();
        }

        return returnValue && moment.duration(returnValue, (~returnValue.indexOf(':') ? 'm' : null) ).asMinutes();
      });

    }
  }

})();