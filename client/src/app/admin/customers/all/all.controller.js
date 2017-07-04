(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminCustomersAllCtrl', AdminCustomersAllCtrl);

  AdminCustomersAllCtrl.$inject = ['$state', 'adminCustomerService', 'dialogService'];

  function AdminCustomersAllCtrl($state, adminCustomerService, dialogService) {
    var vm = this;

    vm.query = {
      order: 'name',
      limit: 10,
      page: 1
    };

    adminCustomerService.getAllCustomers()
      .then((customers) => {
        vm.getAllCustomers = customers;
      });

    vm.remove = (customer) => {
      let ok = () => {
        vm.getAllCustomers.splice(vm.getAllCustomers.indexOf(customer), 1);
        adminCustomerService.removeCustomer(customer._id);
      };
      dialogService.confirmRemoveItem(ok);
    };

    vm.update = (id) => {
      $state.go("admin.customers.update", {id: id});
    };
  }
})();