(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminCustomersCreateCtrl', AdminCustomersCreateCtrl);

  AdminCustomersCreateCtrl.$inject = ['$state', 'adminCustomerService', 'configService'];

  function AdminCustomersCreateCtrl($state, adminCustomerService, configService) {
    var vm = this;

    vm.state = 'create';

    vm.customer = {
      permissions: configService.permissionsPM
    };

    vm.saveCustomer = (customer) => {
      adminCustomerService.createCustomer(customer)
        .then(() => {
          $state.go("admin.customers.all");
        });
    };
  }
})();
