(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminProjectDialogSupplierCtrl', AdminProjectDialogSupplierCtrl);

  /* ngInject */
  function AdminProjectDialogSupplierCtrl(adminUserService, $mdDialog, supplier) {
    var vm = this;

    vm.supplier = supplier;

    adminUserService.getAllSuppliers()
      .then( (suppliers) => {
        vm.suppliers = suppliers;
      });

    vm.add = () => {
      if(!vm.supplier) vm.supplier = null;
      $mdDialog.hide(vm.supplier);
    };

    vm.cancel = () => {
      $mdDialog.hide(supplier);
    };

    vm.changeHandler = () => {
      vm.changed = true;
    };
  }
})();