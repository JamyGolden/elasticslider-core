(function() {
    var gulp = require('gulp');
    var sourcemaps = require('gulp-sourcemaps');
    var sass = require('gulp-sass');
    var concat = require('gulp-concat');
    var connect = require('gulp-connect');
    var babel = require('gulp-babel');
    var uglify = require('gulp-uglify');
    var del = require('del');
    var replace = require('gulp-replace');
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
    gulp.task('prod:clean', function (cb) {
        return del(['dist'], cb);
    });

    gulp.task('prod:angular', ['prod:clean'], function () {
        gulp.src('src/angular-elastic-slider.html')
            .pipe(gulp.dest('dist/angular'))

        gulp.src('src/angular-*.js')
            .pipe(babel())
            .pipe(concat('angular-elasticslider.min.js'))
            .pipe(uglify())
            .pipe(header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dist/angular'));

    });

    gulp.task('prod:polymer', ['prod:clean'], function () {
        gulp.src('src/polymer-elastic-slider.html')
            .pipe(replace(
                '"js/elasticslider.js"',
                '"elasticslider.min.js"'
            ))
            .pipe(replace(
                '"polymer-elasticslider.js"',
                '"polymer-elasticslider.min.js"'
            ))
            .pipe(gulp.dest('dist/polymer'));

        gulp.src('src/polymer-*.js')
            .pipe(babel())
            .pipe(concat('polymer-elasticslider.min.js'))
            .pipe(uglify())
            .pipe(header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dist/polymer'));

    });

    gulp.task('prod:build', ['prod:clean'], function () {
        return gulp.src('src/js/elasticslider.js')
            .pipe(babel())
            .pipe(concat('elasticslider.min.js'))
            .pipe(uglify())
            .pipe(header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dist/angular'))
            .pipe(gulp.dest('dist/polymer'));
    });

    gulp.task('dev', ['sass', 'js', 'connect', 'watch']);
    gulp.task('prod', ['prod:build', 'prod:angular', 'prod:polymer']);
})();
