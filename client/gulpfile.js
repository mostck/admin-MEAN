var gulp = require('gulp'),
  bower = require('gulp-main-bower-files'),
  sourcemaps = require('gulp-sourcemaps'),
  inject = require('gulp-inject'),
  gulpFilter = require('gulp-filter'),
  connect = require('gulp-connect'),
  sass = require('gulp-sass'),
  karma = require('karma'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  livereload = require('gulp-livereload'),
  del = require('del'),
  babel = require('gulp-babel'),
  embedTemplates = require('gulp-angular-embed-templates'),
  templateCache = require('gulp-angular-templatecache'),
  nginclude = require('gulp-nginclude'),
  gulpif = require('gulp-if'),
  args = require('yargs').argv,
  ngAnnotate = require('gulp-ng-annotate'),
  merge = require('merge2'),
  ngConstant = require('gulp-ng-constant'),
  APP_NAME = 'heaterSiloM2M',
  appConfig = {
    API_URL: args.prod ? 'http://52.72.94.194:8195/api': 'http://localhost:3000/api'
  };

gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(nginclude()) // put template with ng-include (only for index.html)
    .pipe(gulp.dest('dist/'));
  // .pipe(notify({ message: 'Html task complete' }));
});

gulp.task('ico', function() {
  return gulp.src('src/*.ico')
    .pipe(gulp.dest('dist/'));
  // .pipe(notify({ message: 'Html task complete' }));
});

gulp.task('bower', function() {
  var jsFilter = gulpFilter('**/*.js', { restore: true });
  var cssFilter = gulpFilter('**/*.css', { restore: true });
  var fontFilter = gulpFilter('**/*.+(eot|svg|ttf|woff|woff2)');

  return gulp.src('./bower.json')
    .pipe(bower())
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(cssFilter.restore)
    .pipe(fontFilter)
    .pipe(rename(function(path) {
      if (~path.dirname.indexOf('fonts')) {
        path.dirname = '/fonts'
      }
    }))
    .pipe(gulp.dest('dist'));
  // .pipe(notify({ message: 'Bower task complete' }));
});

gulp.task('styles', function() {
  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace('src/app/', '');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector:scss',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp.src('src/app/index.scss')
    .pipe(gulpif(!args.prod, sourcemaps.init()))
    .pipe(inject(gulp.src(['src/app/**/*.scss', '!src/app/index.scss']),injectOptions))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulpif(!args.prod, sourcemaps.write()))
    // .pipe(gulpif(args.prod, rename({suffix: '.min'})))
    .pipe(gulpif(args.prod, cssnano()))
    .pipe(gulp.dest('dist/css'));
  // .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  var scripts = gulp.src([
      'src/polyfills/*.js',
      'src/app/app.js',
      'src/app/app.*.js', 
      'src/app/**/!(*spec).js'
    ])
      .pipe(embedTemplates({basePath:'src'})) // put html templates
      .pipe(jshint({esversion: 6}))
      .pipe(jshint.reporter('default'))
      .pipe(gulpif(!args.prod, sourcemaps.init()))
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(concat('index.js'))
      .pipe(gulpif(args.prod, ngAnnotate()))
      // .pipe(gulpif(args.prod, rename({suffix: '.min'})))
      .pipe(gulpif(args.prod, uglify()))
      .pipe(gulpif(!args.prod, sourcemaps.write()))
      .pipe(concat('scripts.js'));

  var config = ngConstant({
        name: APP_NAME + '.config',
        stream: true,
        wrap: false,
        constants: appConfig
      })

  var templates = gulp.src('src/app/templates/*.tmpl.html')
      .pipe(templateCache('templates.js',{module: APP_NAME}));

  return merge(scripts, config, templates)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist/js'))
  // .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('assets', function() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
  // .pipe(notify({ message: 'Assets task complete' }));
});

gulp.task('clean', function(done) {
  del.sync('dist');
  done();
});

gulp.task('build', ['clean'], function() {
  gulp.start('html', 'styles','scripts', 'bower', 'assets', 'ico');
});

// run tests once and close browser
gulp.task('test', function(){
  var server = new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  });

  server.start();
});

// run tests and keep watching test files. rerun on change
gulp.task('tdd', function(done){
  var server = new karma.Server({
    configFile: __dirname + '/karma.conf.js'
  }, done);

  server.start();
});

gulp.task('watch', function() {
  // gulp.watch('src/app/**/*.html', ['scripts']);
  gulp.watch('src/index.html', ['html']);
  gulp.watch('src/app/**/!(*spec).+(js|html)', ['scripts']);
  gulp.watch('src/app/**/*.scss', ['styles']);
  gulp.watch('src/assets/*', ['assets']);

  livereload.listen();

  gulp.watch(['dist/**']).on('change', livereload.changed);
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 8080,
    fallback: __dirname + '/dist/index.html',
    livereload: true
  });
});

gulp.task('default', ['connect', 'watch']);