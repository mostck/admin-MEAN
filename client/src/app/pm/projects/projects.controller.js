(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('pmProjectsAllCtrl', pmProjectsAllCtrl);

  pmProjectsAllCtrl.$inject = ['$state', '$rootScope', 'adminProjectService', 'userService'];

  function pmProjectsAllCtrl($state, $rootScope, adminProjectService, userService) {
    /*jshint validthis:true */
    var vm = this;

    var currentUser = userService.currentUser();

    vm.query = {
      order: 'name',
      limit: 10,
      page: 1
    };

    adminProjectService.getAllProjectsCustomer(currentUser.customer)
      .then((projects) => {
        if (currentUser.roleId == 6) {
          vm.getAllProjects = projects.filter(proj => {
            return proj.pm == currentUser._id;
          });
        } else {
          vm.getAllProjects = projects;
        }
      });
  }
})();
