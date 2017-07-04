(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('validationCustomer', validationCustomer);

  validationCustomer.$inject = ['$timeout'];

  function validationCustomer($timeout) {
    return {
      require: 'ngModel',
      scope: {
        pmsAdmin: '=',
        pmsRole: '='
      },
      link: function(scope, element, attr, mCtrl) {
        var isValid = (viewValue) => {
          return scope.pmsRole != 5 || scope.pmsAdmin.length === 0 || scope.pmsAdmin.some((admin) => {
              return admin.customer != viewValue;
            });
        };

        var check = function(value) {
          mCtrl.$setValidity('customer', isValid(value));

          return value;
        };

        mCtrl.$parsers.unshift(function(value) {
          return check(value);
        });

        scope.$watch('pmsRole', function(value) {
          if(scope.pmsAdmin) check(mCtrl.$viewValue);
        });
      }
    };
  }
})();