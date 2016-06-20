var fs = require('fs');
var gulp = require('gulp');
/* Read dependencies from package.json and inject them: */
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var del = require('del');  // Manually added because it does not follow "gulp-*" pattern


var SRC              = '../app/**/*.js';
var TMP              = 'tmp/';
var DIST              = '../dist/';
var DASHBOARD_JS      = 'dashboardApp.js';
var DASHBOARD_MIN_JS  = 'dashboardApp.min.js';


var pkg = require('./package.json');
var banner = ['/**',
 ' * <%= pkg.name %> - <%= pkg.description %>',
 ' * @version v<%= pkg.version %>',
 ' * @link <%= pkg.homepage %>',
 ' */',
 ''].join('\n');


gulp.task('clean', function() {
   return del([TMP + '/**']);
});

gulp.task('lint', function() {
   var jshint = plugins.jshint;
   return gulp.src(SRC)
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
});

gulp.task('concat', function (cb) {
   return gulp.src(SRC)
      //.pipe(plugins.header(banner, {pkg : pkg}))  // Here it would put it before each concatenated file.
      // After 'concat' gives an error.
      .pipe(plugins.concat(DASHBOARD_JS))
      // We could also write it to DIST, but we will not use it afterwards.
      .pipe(gulp.dest(TMP));
});

gulp.task('minimize', ['concat'], function (cb) {
   return gulp.src(TMP + '/**.js')
      .pipe(plugins.uglify())
      .pipe(plugins.header(banner, {pkg : pkg}))
      .pipe(plugins.rename(DASHBOARD_MIN_JS))
      .pipe(gulp.dest(DIST));
});

// Other tasks that we might add in the future: 'bundle-js-individual', 'bundle-css', 'copy'
gulp.task('bundle', ['concat', 'minimize']);

// The watch task (to automatically rebuild when the source code changes)
gulp.task('watch', function () {
  gulp.watch(['../data/**/*'], ['lint', 'bundle']);
});

// The default task (called when you run `gulp`)
gulp.task('default', ['lint', 'bundle']);
// Default + watch
gulp.task('run', ['default', 'watch']);