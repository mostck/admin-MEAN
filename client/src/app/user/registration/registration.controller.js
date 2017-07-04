(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('UserRegistrationCtrl', UserRegistrationCtrl);

  UserRegistrationCtrl.$inject = ['userService', 'adminCompanyService'];

  function UserRegistrationCtrl(userService, adminCompanyService) {
    var vm = this;

    adminCompanyService.getAllCompanies()
      .then( (companies) => {
        vm.getAllCompanies = companies;
      });

    vm.registerUser = (username, email, password, companyId) => {
      userService.register(username, email, password, companyId);
    };

  }
})();