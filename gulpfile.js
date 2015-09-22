(function() {
    var gulp = require('gulp');
    var sourcemaps = require('gulp-sourcemaps');
    var sass = require('gulp-sass');
    var concat = require('gulp-concat');
    var connect = require('gulp-connect');
    var babel = require('gulp-babel');
    var uglify = require('gulp-uglify');
    var vinylPaths = require('vinyl-paths');
    var del = require('del');
    var stripDebug = require('gulp-strip-debug');
    var header = require('gulp-header');
    var pkg = require('./package.json');
    var banner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''].join('\n');

    // Develop build
    // ========================================================================
    gulp.task('sass', function() {
        return gulp.src('src/scss/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle: 'compressed'
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('src/css'))
            .pipe(connect.reload());
    });

    gulp.task('js', function () {
        gulp.src([
                'src/js/elasticslider.js',
            ])
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(concat('elasticslider.min.js'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('src/js/'))
            .pipe(connect.reload());

        gulp.src([
                'src/js/polymer-elasticslider.js',
            ])
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(concat('polymer-elasticslider.min.js'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('src/js/'))
            .pipe(connect.reload());
    });

    gulp.task('watch', function () {
        gulp.watch('src/scss/**/*.scss', ['sass']);
        gulp.watch('src/js/**/*.js', ['js']);
    });

    gulp.task('connect', function() {
        connect.server({
            port: 5123,
            root: 'src',
            livereload: true
        });
    });

    // Production build
    // ========================================================================
    gulp.task('prod:clean', function () {
        return gulp.src('dist/*')
            .pipe(stripDebug())
            .pipe(vinylPaths(del));
    });

    gulp.task('prod:build', function () {
        gulp.src('src/js/*.js')
            .pipe(babel())
            .pipe(concat('elasticslider.min.js'))
            .pipe(uglify())
            .pipe(header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('dev', ['sass', 'js', 'connect', 'watch']);
    gulp.task('prod', ['prod:clean', 'prod:build']);
})();
