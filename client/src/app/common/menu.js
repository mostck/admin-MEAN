(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .service('menuService', menuService);

  menuService.$inject = ['userService'];

  function menuService(userService) {
    /* jshint validthis: true */
    this.getMain = getMain;
    this.getPermission = getPermission;

    function getMain() {
      const userRole = userService.getUserRole(),
        userPermissions = userService.getUserPermisions();

      return {
        admin: {
          sref: "admin",
          value: userRole == 2 ? "header.admin" : "header.employee",
          permission: !(userRole == 2 || userRole == 3),

          menu: {
            company: {
              sref: "admin.company",
              value: "admin.company",
              permission: userRole == 3,
            },

            users: {
              sref: "admin.users",
              value: "admin.users",
              permission: userRole == 3,

              menu: {
                all: {
                  sref: "admin.users.all",
                  value: "admin.all"
                },
                create: {
                  sref: "admin.users.create",
                  value: "admin.create"
                }
              }
            }
          }
        },

        myAccount: {
          sref: "myAccount",
          value: "header.myAccount",
          permission: userRole == 1,
          submenu: {
            settings: {
              sref: "myAccount.settings",
              value: "user.settings"
            },
            logout: {
              sref: "myAccount.logout",
              value: "header.logout"
            }
          }
        }
      };
    }

    function getPermission(sref) {
      const main = getMain(),
        item = search(main, sref),
        permission = item && item.permission;

      function search(obj, sref) {
        let result;

        for (let key in obj) {
          if (obj[key].sref === sref) {
            result = obj[key];
          } else if (typeof obj[key] === 'object') {
            result = search(obj[key], sref);
          }

          if (result) break;
        }

        return result;
      }

      return true; // need remove
      // return permission === undefined ? true : !permission;
    }
  }
})();