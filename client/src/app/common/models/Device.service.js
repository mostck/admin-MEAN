(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .factory('Device', DeviceFactory);

  DeviceFactory.$inject = ['Model', 'compareDateRanges'];
  /* @ngInject */
  function DeviceFactory(Model, compare) {
    class Device extends Model {
      constructor(device) {
        super(device);
        // this.availability = 2;
      }
      /**
       * check availability of device between dates
       * @param  {[date]}   options.startDate: from
       * @param  {[date]}   options.endDate:   to  
       * @return {[number]}                    0 - device is not available during period;
       *                                       1 - device is partially available during period;
       *                                       2 - device is available during period.
       */
      getAvailability(project) {
        const schedule = this.getSchedule();
        let availability = 2;

        for (const period of schedule) {
          if (period.project && period.project._id === project._id) { continue; }
          if (compare.isContained(period, project)) {
            availability = 0;
            break;
          } else if (compare.isIntersected(project, period)) {
            availability = 1;
            break;
          }
        }

        return availability;
      }
      getSchedule() {
        let schedule = [];

        if (this.projects instanceof Array) {
          for(const project of this.projects) {
            if (project.objects instanceof Array) {
              for(const object of project.objects) {
                if (object.silos instanceof Array) {
                  for(const silo of object.silos) {
                    if (this.type === 'silo' && this._id === silo._id) {
                      schedule.push({
                        project: {_id: project._id, name: project.name},
                        object: {_id: object._id, name: object.name},
                        from: moment(silo.startDate),
                        to: moment(silo.endDate),
                      });
                    } else if (silo.heaters instanceof Array) {
                      for(const heater of silo.heaters) {
                        if (this._id === heater._id) {
                          schedule.push({
                            project: {_id: project._id, name: project.name},
                            object: {_id: object._id, name: object.name},
                            from: moment(heater.startDate),
                            to: moment(heater.endDate),
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (this.logbook instanceof Array) {
          for (const record of this.logbook) {
            if (record.reason === 'planned_service') {
              schedule.push({
                from: moment(record.startDate).startOf('d'),
                to: moment(record.endDate).startOf('d'),
              });
            }
          }
        }

        return schedule;
      }
    }

    return Device;
  }
})();