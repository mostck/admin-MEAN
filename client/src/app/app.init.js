(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .run(init);

  /* ngInject */
  function init($state,
    $rootScope,
    userService,
    localeService,
    configService,
    menuService,
    $deepStateRedirect,
    $mdDateLocale
  ) {
    $rootScope.loading = true;

    localeService.init();
    setMdDateLocale(localeService.get());

    let currentUser = userService.currentUser();

    $rootScope.$on('$stateChangeStart', stateChangeStartHandler);
    
    
    function stateChangeStartHandler(event, toState, toParams, toOptions) {
      $deepStateRedirect.reset();

      if (toState.name === 'login' && userService.isLoggedIn()) {
        event.preventDefault();
        
        let roleId = userService.getUserRole(),
          state = roleId === 1 ? 'superAdmin' :
                  ~[5,6].indexOf(roleId) ? 'pm.projects' :
                  roleId === 4 ? 'supplier.silos' : 'myAccount';

        // $state.go(state);
        $state.go('admin');
      }

      if (toState.defaultSubstate) {
        event.preventDefault();
        $state.go(toState.defaultSubstate);
      }

      if(!configService.notNeedAuthentication.some(elem => elem == toState.name)) {
        if (!userService.isLoggedIn()) {
          if (event) {
            event.preventDefault();
          }

          $rootScope.$broadcast('user.authenticate', false);

          $state.go('login', {
            redirectTo: toState,
            redirectToParams: toParams
          }, {
            inherit: false
          });
        } else {
          // console.log('check permision', toState.name,toState.name.indexOf('.'));
          // if(toState.name.indexOf('.') != -1){
          //   console.log(toState.name, menuService.getPermission(toState.name))
          // }
          // if(toState.name.indexOf('.') != -1 ? !menuService.getPermission(toState.name.slice(0,toState.name.indexOf('.'))) : !menuService.getPermission(toState.name)) {
          if(!menuService.getPermission(toState.name.split('.')[0])) {
            if (event) {
              event.preventDefault();
            }
            $state.go('permissionDenied');
          }
        }
      }
    }

    $rootScope.$on('changeLanguage', (evt, locale) => setMdDateLocale(locale));

    function setMdDateLocale(locale) {
      const localeData = moment.localeData(locale);
      $mdDateLocale.shortMonths = localeData.monthsShort();
      $mdDateLocale.shortDays = localeData.weekdaysMin();
    }
  }
})();