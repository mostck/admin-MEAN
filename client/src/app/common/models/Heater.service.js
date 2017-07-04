(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('Heater', HeaterFactory);

  HeaterFactory.$inject = ['Device', 'COLORS'];

  /* @ngInject */
  function HeaterFactory(Device, COLORS) {
    class Heater extends Device {
      constructor(heater) {
        super(heater);
        this.type = 'heater';
        this.color = COLORS.heater;

        if (!this.heater) this.heater = heater._id;
        if (typeof(this.heater) === 'object') {
          angular.extend(this, this.heater);
        }
      }
    }

    return Heater;
  }
})();