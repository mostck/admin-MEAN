(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('CRURecord', CRURecordFactory);

  /* @ngInject */
  function CRURecordFactory() {
    class CRURecord {
      constructor(record) {
        angular.extend(this, record);

        if (typeof(this.startDate) === 'string') {
          this.startDate = new Date(this.startDate);
        }
        if (typeof(this.endDate) === 'string') {
          this.endDate = new Date(this.endDate);
        }
      }
      addSparePart(part) {
        part = part || '';

        if (this.spareParts instanceof Array) {
          this.spareParts.push(part);
        } else {
          this.spareParts = [part];
        }
      }
      removeSparePart(index) {
        this.spareParts.splice(index, 1);
      }
      toJSON() {
        let result = {};

        for (let x in this) {
          if (x === "startDate" || x === "endDate") {
            result[x] = moment(this[x]).utc().toJSON();
            continue;
          }
          result[x] = this[x];
        }
        return result;
      }
    }

    return CRURecord;
  }
})();