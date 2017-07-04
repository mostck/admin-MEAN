(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminProjectsAllCtrl', AdminProjectsAllCtrl);

  AdminProjectsAllCtrl.$inject = ['$state', '$rootScope', 'adminProjectService', 'dialogService', 'userService'];

  function AdminProjectsAllCtrl($state, $rootScope, adminProjectService, dialogService, userService) {
    var vm = this;

    vm.permissionRead = $rootScope.userRole == 3 && ($rootScope.userPermissions && !$rootScope.userPermissions.projectsAll.read);
    vm.permissionWrite = $rootScope.userRole == 3 && ($rootScope.userPermissions && !$rootScope.userPermissions.projectsAll.write);

    vm.query = {
      order: 'name',
      limit: 10,
      page: 1
    };

    adminProjectService.getAllProjects()
      .then((projects) => {
        vm.projects = projects;
        if ($rootScope.userRole == 3) {
          var permissionRead = ($rootScope.userPermissions && !$rootScope.userPermissions.projectsOwner.read);
          var permissionWrite = ($rootScope.userPermissions && !$rootScope.userPermissions.projectsOwner.write);
          var id = userService.currentUser()._id;
          console.log('$rootScope.userPermissions', $rootScope.userPermissions);
          console.log('permissionRead', permissionRead);
          console.log('permissionWrite', permissionWrite);
          console.log('userService.currentUser()._id', userService.currentUser()._id);
          vm.projects.forEach(function (proj) {
            console.log('proj.employee', proj.employee);
            if (proj.employee == id) {
              proj.permissionRead = !permissionRead;
              proj.permissionWrite = !permissionWrite;
            }
          });
        }

      });

    vm.remove = (project) => {
      let ok = () => {
        vm.projects.splice(vm.projects.indexOf(project), 1);
        adminProjectService.remove(project._id);
      };
      dialogService.confirmRemoveItem(ok);
    };

    vm.update = (id) => {
      $state.go("admin.projects.update", {id: id});
    };

    vm.copy = (id) => {
      $state.go("admin.projects.copy", {id: id});
    };
  }
})();