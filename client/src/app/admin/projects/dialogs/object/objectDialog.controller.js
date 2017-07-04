(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('ObjectDialogCtrl', ObjectDialogCtrl);

  /* ngInject */
  function ObjectDialogCtrl($mdDialog, object) {
    var vm = this;

    vm.state = object ? 'update' : 'create';

    vm.object = object || {
      location: {},
      silos: []
    };

    vm.daysOfWeek = [
      {id: 1, name: "dayOfWeek.monday"},
      {id: 2, name: "dayOfWeek.tuesday"},
      {id: 3, name: "dayOfWeek.wednesday"},
      {id: 4, name: "dayOfWeek.thursday"},
      {id: 5, name: "dayOfWeek.friday"},
      {id: 6, name: "dayOfWeek.saturday"},
      {id: 7, name: "dayOfWeek.sunday"}
    ];

    vm.save = object => {
      $mdDialog.hide(object);
    };

    vm.cancel = $mdDialog.hide;
  }
})();
