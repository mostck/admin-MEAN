(() => {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('supplierOrdersAllCtrl', supplierOrdersAllCtrl);

  supplierOrdersAllCtrl.$inject = ['adminOrderService', 'userService', 'configService'];

  function supplierOrdersAllCtrl(adminOrderService, userService, configService) {
    /*jshint validthis:true */
    var vm = this;

    vm.title = 'supplierOrdersAllCtrl';
    vm.dateFormat = configService.dateFormat;

    vm.query = {
      order: '-createdAt',
      limit: 10,
      page: 1
    };

    activate();

    ////////////////

    function activate() {
      adminOrderService.getAllSupplier(userService.currentUser()._id)
        .then( orders => vm.orders = orders );
    }
  }
})();