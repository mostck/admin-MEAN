(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminOrdersCreateCtrl', AdminOrdersCreateCtrl);

  AdminOrdersCreateCtrl.$inject = [
    '$state',
    'adminDeviceService',
    'adminOrderService',
    'Toast'
    ];

  /* @ngInject */
  function AdminOrdersCreateCtrl($state, deviceService, orderService, Toast) {
    let vm = this;

    vm.title = 'AdminOrdersCreateCtrl';

    activate();

    ////////////////

    function activate() {
      deviceService.getAllCurrentSilos().then(silos => vm.silos = silos);
    }

    vm.createOrder = order => {
      order.supplier = order.silo.supplier;
      order.amountOfTons = order.silo.maxLoad;
      orderService.create(order).then(res => {
        $state.go('admin.orders.all');
        Toast.success('alert.created');
      });
    };
  }
})();