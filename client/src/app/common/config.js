(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .constant('configService', {
      defaultLocale: "en",
      getApiUri: 'http://localhost:3000/api',
      // getApiUri: 'http://52.72.94.194:8195/api',
      // getApiUri: 'http://10.0.2.2:3000/api', // for windows in the virtual machine

      userRoles: [
        {id: 1, name: "Admin"},
        {id: 2, name: "User"},
      ],

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

      notNeedAuthentication: ['login', 'forgot', 'reset', 'registration', 'permissionDenied']
    });

})();