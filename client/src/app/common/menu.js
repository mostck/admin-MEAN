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

        silo: {
          sref: "silo",
          permission: userRole == 5 || userRole == 6
        },

        heater: {
          sref: "heater",
          permission: userRole == 4
        },

        supplier: {
          sref: "supplier",
          permission: userRole != 4
        },

        supplierSilos: {
          sref: "supplier.silos",
          value: "header.silos",
          permission: userRole != 4
        },

        supplierOrders: {
          sref: "supplier.orders",
          value: "header.orders",
          permission: userRole != 4
        },

        pm: {
          sref: "pm",
          permission: !(userRole == 5 || userRole == 6)
        },

        pmProjects: {
          sref: "pm.projects",
          value: "header.projects",
          permission: !(userRole == 5 || userRole == 6)
        },


        pmHeaters: {
          sref: "pm.heaters",
          value: "header.heaters",
          permission: !(userRole == 5 || userRole == 6)
        },

        pmUsers: {
          sref: "pm.users",
          value: "header.users",
          permission: userRole != 5,

          menu: {
            all: {
              sref: "pm.users.all",
              value: "admin.all"
            },
            create: {
              sref: "pm.users.create",
              value: "admin.create"
            }
          }
        },

        superAdmin: {
          sref: "superAdmin",
          value: "header.superAdmin",
          permission: userRole != 1,
          submenu: {
            logout: {
              sref: "superAdmin.logout",
              value: "header.logout"
            }
          },
          menu: {
            config: {
              sref: "superAdmin.config",
              value: "admin.config"
            },
            adminUsers: {
              sref: "superAdmin.adminUsers",
              value: "admin.adminUsers",

              menu: {
                all: {
                  sref: "superAdmin.adminUsers.all",
                  value: "admin.all"
                },
                create: {
                  sref: "superAdmin.adminUsers.create",
                  value: "admin.create"
                }
              }
            },
            companies: {
              sref: "superAdmin.companies",
              value: "admin.companies",

              menu: {
                all: {
                  sref: "superAdmin.companies.all",
                  value: "admin.all"
                },
                create: {
                  sref: "superAdmin.companies.create",
                  value: "admin.create"
                }
              }
            },
            logs: {
              sref: "superAdmin.logs",
              value: "admin.logs"
            }
          }
        },

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
            },

            customers: {
              sref: "admin.customers",
              value: "admin.customers",
              permission: userRole == 3,

              menu: {
                all: {
                  sref: "admin.customers.all",
                  value: "admin.all"
                },
                create: {
                  sref: "admin.customers.create",
                  value: "admin.create"
                }
              }
            },

            projects: {
              sref: "admin.projects",
              value: "admin.projects",
              permission: userRole == 3 && (userPermissions && (!userPermissions.projectsAll.read && !userPermissions.projectsOwner.read)),

              menu: {
                all: {
                  sref: "admin.projects.all",
                  value: "admin.all"
                },
                create: {
                  sref: "admin.projects.create",
                  value: "admin.create",
                  permission: userRole == 3 && (userPermissions && !userPermissions.projectsAll.write)
                },
                schedule: {
                  sref: "admin.projects.schedule",
                  value: "admin.schedule"
                }
              }
            },

            devices: {
              sref: "admin.devices",
              value: "admin.devices",
              permission: userRole == 3 && (userPermissions && !userPermissions.devices.read),

              menu: {
                all: {
                  sref: "admin.devices.all",
                  value: "admin.all"
                },
                create: {
                  sref: "admin.devices.create",
                  value: "admin.create",
                  permission: userRole == 3 && (userPermissions && !userPermissions.devices.write)
                }
              }
            },

            orders: {
              sref: "admin.orders",
              value: "admin.orders",

              menu: {
                all: {
                  sref: "admin.orders.all",
                  value: "admin.all"
                },
                create: {
                  sref: "admin.orders.create",
                  value: "admin.create"
                }
              }
            },

            statistics: {
              sref: "admin.statistics",
              value: "admin.statistics",

              menu: {
                all: {
                  sref: "admin.statistics.projects",
                  value: "admin.projects"
                },
                create: {
                  sref: "admin.statistics.suppliers",
                  value: "admin.suppliers"
                }
              }
            },

            logs: {
              sref: "admin.logs",
              value: "admin.logs",
              permission: userRole == 3
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

      // return permission === undefined || permission.permission === undefined ? true : !permission.permission;
      return permission === undefined ? true : !permission;
    }
  }
})();