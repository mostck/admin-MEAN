(() => {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminOrdersAllCtrl', AdminOrdersAllCtrl);

  AdminOrdersAllCtrl.$inject = ['adminOrderService', 'configService', 'dialogService'];

  /* @ngInject */
  function AdminOrdersAllCtrl(orderService, configService, dialogService) {
    var vm = this;
    vm.title = 'AdminOrdersAllCtrl';
    vm.dateFormat = configService.dateFormat;

    vm.states = {
      Orders: 'open',
      Delivery: 'delivered'
    };

    vm.query = {
      order: '-createdAt',
      limit: 10,
      page: 1,
      status: 'open'
    };

    vm.remove = (order) => {
      let ok = () => {
        vm.orders.splice(vm.orders.indexOf(order), 1);
        orderService.remove(order._id);
      };
      dialogService.confirmRemoveItem(ok);
    };

    activate();

    ////////////////

    function activate() {
      orderService.getAll()
        .then( orders => vm.orders = orders );
    }
  }
})();