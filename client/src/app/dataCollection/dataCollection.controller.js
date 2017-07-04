(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('DataCollectionCtrl', DataCollectionCtrl);

  DataCollectionCtrl.$inject = ['adminDeviceService'];

  function DataCollectionCtrl(adminDeviceService) {
    var vm = this;

    function getHeaterDataCollection() {
      adminDeviceService.getHeaterDataCollection()
        .then((res) => {
          vm.data = res;
        });
    }

    getHeaterDataCollection();

    vm.deleteAllDataCollection = () => {
      vm.data = null;
      adminDeviceService.deleteAllHeaterDataCollection();
    };
  }
})();
