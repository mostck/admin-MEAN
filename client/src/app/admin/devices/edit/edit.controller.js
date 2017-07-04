(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminDevicesEditCtrl', AdminDevicesEditCtrl);

  AdminDevicesEditCtrl.$inject = ['$scope', 'adminDeviceService', '$state', '$stateParams', 'utils'];

  function AdminDevicesEditCtrl($scope, adminDeviceService, $state, $stateParams, utils) {
    let vm = this,
      type = $stateParams.type;

    vm.state = $state.current.name.split('.').slice(-1)[0];

    if (vm.state === 'create') {
      vm.device = {
        type: type,
        location: {}
      };
    } else if (vm.state === 'update') {
      let method = 'get' + utils.capitalize(type);

      adminDeviceService[method]($stateParams.id)
        .then(device => {
          if (device) vm.device = device;
        })
        .catch(() => { $state.go('404', {}, {location: "replace"}); });
    }

    vm.save = device => {
      let method = vm.state + utils.capitalize(vm.device.type);

      adminDeviceService[method](device)
        .then(() => {
          $state.go('admin.devices.all');
        })
        .catch(err => {
          if (err.data.code === 11000) {
            $scope.deviceForm.serial.$setValidity('unique', false);
          }
        });
    };

    $scope.$watch(() => vm.device && vm.device.serial, () => {
      if ($scope.deviceForm.serial.$invalid) {
        $scope.deviceForm.serial.$setValidity('unique', true);
      }
    });
  }
})();