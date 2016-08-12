var fs = require('fs');
var gulp = require('gulp');
/* Read dependencies from package.json and inject them: */
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var del = require('del');  // Manually added because it does not follow "gulp-*" pattern
var Server = require('karma').Server;


var SRC               = '../app/';
var SRC_JS            = SRC + '**/*.js';
var TEMPLATES         = SRC + 'templates/*.html';
var TMP               = 'tmp/';
var TEMPLATE_JS        = 'templates.js';
var DIST              = TMP + 'dist/';
var RELEASE_DIR       = '../dist/';
var DASHBOARD_JS      = 'dashboardApp.js';
var DASHBOARD_MIN_JS  = 'dashboardApp.min.js';



gulp.task('clean', function(done) {
    return del([TMP + '**'], done);
});

// Vendor files will be moved by maven to the "target" directory to be bundled in the .war.
gulp.task('extract_dependencies', ['bundle'], function() {
    var d = 'bower_components/'
    var dependencies = [d + 'angular/angular.min.js',
                        d + 'angular-route/angular-route.min.js',
                        d + 'angular-eonasdan-datetimepicker/dist/angular-eonasdan-datetimepicker.min.js',
                        d + 'eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                        d + 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                        d + 'bootstrap/dist/**',
                        d + 'vis/dist/**',
                        d + 'moment/min/moment.min.js',
                        d + 'nouislider/distribute/**',
                        // Warning: newer versions require a npm resolver
                        d + 'Chart.js/dist/Chart.min.js',
                        d + 'jquery/dist/jquery.min.js',
                        d + 'ptAnywhere-widget/dist/**',
                        d + 'ptAnywhere-widget/app/locale/**']
    return gulp.src(dependencies)
                .pipe(gulp.dest(TMP + 'vendors'));
});

gulp.task('lint', function() {
   var jshint = plugins.jshint;
   return gulp.src(SRC_JS)
                .pipe(jshint())
                .pipe(jshint.reporter('default'));
});

gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.ci.js'
    }, function(exitCode) {
        // http://stackoverflow.com/questions/37551521/why-does-gulp-error-when-passing-the-done-function-to-karmas-server
        done();
    }).start();
});

function bumpIt(versionType) {
    return gulp.src(['./bower.json', './package.json'])
                .pipe(plugins.bump({type: versionType}))
                .pipe(gulp.dest('./'));
}

gulp.task('bump', function(cb) {
    bumpIt('prerelease').on('end', cb);
});

gulp.task('bump_parametrized', function(cb) {
    var argv = require('yargs').argv;
    var vType = (argv.version === undefined)? 'minor': argv.version;
    bumpIt(vType).on('end', cb);
});

gulp.task('templateCaching', ['clean'], function() {
    var templateCache = plugins.angularTemplatecache;
    return gulp.src(TEMPLATES)
                .pipe(templateCache(TEMPLATE_JS, {module: 'ptAnywhere.dashboard.templates'}))
                .pipe(gulp.dest(TMP));
});

gulp.task('concat', ['templateCaching'], function() {
   return gulp.src([SRC_JS, TMP + TEMPLATE_JS])
              .pipe(plugins.concat(DASHBOARD_JS))
              .pipe(gulp.dest(DIST));
});

gulp.task('minimize', ['concat'], function() {
    return gulp.src(DIST + DASHBOARD_JS)
                .pipe(plugins.uglify())
                .pipe(plugins.rename(DASHBOARD_MIN_JS))
                .pipe(gulp.dest(DIST));
});

gulp.task('headers', ['minimize'], function() {
    var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    var banner = ['/**',
                 ' * <%= pkg.name %> - <%= pkg.description %>',
                 ' * @version v<%= pkg.version %>',
                 ' * @link <%= pkg.homepage %>',
                 ' */',
                 ''].join('\n');
   return gulp.src([DIST + '**.js'])
              .pipe(plugins.header(banner, {pkg : pkg}))
              .pipe(gulp.dest(DIST));
});

gulp.task('bundle', ['concat', 'minimize', 'headers']);

gulp.task('build', ['extract_dependencies', 'lint', 'test', 'bundle']);

gulp.task('watch', function() {
    gulp.watch([SRC_JS], ['lint', 'test']);
});

gulp.task('release', ['bump_parametrized', 'build'], function() {
    return gulp.src(DIST + '**')
                .pipe(gulp.dest(RELEASE_DIR));
});

gulp.task('default', ['bump', 'build']);
