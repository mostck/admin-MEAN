(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminCustomersUpdateCtrl', AdminCustomersUpdateCtrl);

  /* ngInject */
  function AdminCustomersUpdateCtrl(
    $state, adminCustomerService, configService, $stateParams, customer) {
    var vm = this;

    vm.state = 'update';

    vm.customer = customer;

    vm.customer.permissions = vm.customer.permissions || configService.permissionsPM;

    vm.saveCustomer = (customer) => {
      adminCustomerService.updateCustomer(customer)
        .then(() => {
          $state.go("admin.customers.all");
        });
    };

    
  }
})();
