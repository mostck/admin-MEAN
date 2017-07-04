(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('CompanyModel', CompanyFactory);

  /* @ngInject */
  function CompanyFactory() {
    const TIME_FORMAT = 'HH:mm';

    class Company {
      constructor(record) {
        angular.extend(this, record);

        if (this.officeTime && typeof(this.officeTime.startTime) === 'string') {
          this.officeTime.startTime = toUtcMoment(this.officeTime.startTime);
        }
        if (this.officeTime && typeof(this.officeTime.endTime) === 'string') {
          this.officeTime.endTime = toUtcMoment(this.officeTime.endTime);
        }
        if (typeof(this.reminderTime) === 'string') {
          this.reminderTime = toMoment(this.reminderTime);
        }
        if (typeof(this.reminderProjTime) === 'string') {
          this.reminderProjTime = toMoment(this.reminderProjTime);
        }
      }
      toJSON() {
        let result = {};

        for (let x in this) {
          if (x === "officeTime") {
            result[x] = {
              startTime: this[x].startTime && toUtcTime(this[x].startTime),
              endTime: this[x].endTime && toUtcTime(this[x].endTime),
              daysOfWeek: this[x].daysOfWeek
            };
            continue;
          }
          if (x === 'reminderTime') {
            result[x] = toTime(this[x]);
            continue;
          }
          if (x === 'reminderProjTime') {
            result[x] = toTime(this[x]);
            continue;
          }
          result[x] = this[x];
        }
        return result;
      }
    }

    function toUtcMoment(str) {
      return moment.utc(str, TIME_FORMAT);
    }

    function toUtcTime(date) {
      return moment.utc(date).format(TIME_FORMAT);
    }

    function toMoment(str) {
      return moment(str, TIME_FORMAT);
    }

    function toTime(date) {
      return moment(date).format(TIME_FORMAT);
    }

    return Company;
  }
})();