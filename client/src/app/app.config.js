(function() {
  'use strict';
  angular
    .module('heaterSiloM2M')
    .config(config);

  /* ngInject */
  function config(
    $locationProvider,
    $translateProvider,
    $httpProvider,
    localStorageServiceProvider,
    configService,
    $mdThemingProvider,
    $mdDateLocaleProvider,
    $mdAriaProvider,
    $animateProvider
  ) {
    $httpProvider.interceptors.push('TokenInterceptor');

    $translateProvider.useLoader('translateLoader', {
      prefix: configService.getApiUri + '/lang?lang=',
      suffix: '.json'
    });
    // $translateProvider.useUrlLoader($translateStaticFilesLoader, configService.getApiUri + '/lang');
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.preferredLanguage('en');

    localStorageServiceProvider
      .setPrefix('heaterSiloM2M')
      .setStorageType('localStorage')
      .setNotify(false, false);

    $mdThemingProvider.definePalette('siloorange', {
      '50': '#ffffff',
      '100': '#ffd2bd',
      '200': '#ffac85',
      '300': '#ff7c3d',
      '400': '#ff671f',
      '500': '#ff5200',
      '600': '#e04800',
      '700': '#c23e00',
      '800': '#a33400',
      '900': '#852b00',
      'A100': '#ffffff',
      'A200': '#ffd2bd',
      'A400': '#ff671f',
      'A700': '#c23e00',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 400 A100 A200 A400'
    });

    $mdThemingProvider.definePalette('siloblue', {
      '50': '#ffffff',
      '100': '#e4edf1',
      '200': '#bfd5de',
      '300': '#90b7c5',
      '400': '#7caabb',
      '500': '#689db0',
      '600': '#568fa4',
      '700': '#397690',
      '800': '#416c7c',
      '900': '#365a67',
      'A100': '#ffffff',
      'A200': '#e4edf1',
      'A400': '#7caabb',
      'A700': '#4b7e90',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 400 500 600 A100 A200 A400'
    });

    angular.extend($mdThemingProvider.theme('default').foregroundPalette, {
      '1' : "#397690",
      '2' : "#397690",
      '3' : "#397690",
      '4' : "#397690"
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('siloorange')
      .accentPalette('siloblue');


    $mdDateLocaleProvider.firstDayOfWeek = 1;

    $mdDateLocaleProvider.formatDate = function(date) {
      var m = moment(date);
      return m.isValid() ? m.format('DD/MM/YYYY') : '';
    };

    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'DD/MM/YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    // const localeData = moment.localeData(configService.defaultLocale);
    // $mdDateLocaleProvider.shortMonths = localeData.monthsShort();
    // $mdDateLocaleProvider.shortDays = localeData.weekdaysMin();

    $mdAriaProvider.disableWarnings();


    $animateProvider.classNameFilter(/angular-animate/);
  }
})();