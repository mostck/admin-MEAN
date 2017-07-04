(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('FooterCtrl', FooterCtrl);

  /* ngInject */
  function FooterCtrl($rootScope, userService, companyService) {
    var vm = this;

    function getCompany() {
      companyService.getCompany().then(company => {
        vm.company = company;
      });
    }

    getCompany();

    $rootScope.$on('user.authenticate', (event, bool) => {
      if (bool) {
        getCompany();
      } else {
        vm.company = null;
      }
    });

  }
})();
