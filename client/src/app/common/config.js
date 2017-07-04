(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .constant('configService', {
      defaultLocale: "en",
      getApiUri: 'http://localhost:3000/api',
      // getApiUri: 'http://52.72.94.194:8195/api',
      // getApiUri: 'http://10.0.2.2:3000/api', // for windows in the virtual machine
      userSuperRoles: [
        {id: 1, name: "Super Admin"},
        {id: 2, name: "Admin"}
      ],
      userRoles: [
        {id: 2, name: "Admin"}, // (SET)
        {id: 3, name: "Employee"}, // (SET)
        {id: 4, name: "Supplier"},
        {id: 5, name: "PM(admin)"}, // Customer
        {id: 6, name: "PM"},
      ],
      userPMRoles: [
        {id: 6, name: "PM"}
      ],

      permissionsEmployee: {
        projectsAll: {read: true, write: true},
        projectsOwner: {read: true, write: true},
        devices: {read: true, write: true}
      },

      permissionsPM: {
        status: {read: true},
        alarm: {read: true},
        operatingHours: {read: true},
        ashLevel: {read: true}
      },

      daysOfWeek: [
        {id: 1, name: "dayOfWeek.monday"},
        {id: 2, name: "dayOfWeek.tuesday"},
        {id: 3, name: "dayOfWeek.wednesday"},
        {id: 4, name: "dayOfWeek.thursday"},
        {id: 5, name: "dayOfWeek.friday"},
        {id: 6, name: "dayOfWeek.saturday"},
        {id: 7, name: "dayOfWeek.sunday"}
      ],

      dateFormat: 'H:mm dd/MM/yyyy',
      logDateFormat: 'H:mm:ss dd/MM/yyyy',

      notNeedAuthentication: ['login', 'forgot', 'reset', 'dataCollection', 'permissionDenied']
    });

})();