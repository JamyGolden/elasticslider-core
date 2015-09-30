var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var del = require('del');
var uglify = require('gulp-uglify');
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
// ============================================================================
gulp.task('js', function () {
    gulp.src([
            'src/js/elasticslider.js',
        ])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('elasticslider.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/js/'));
});

gulp.task('watch', function () {
    gulp.watch('src/elasticslider.js', ['js']);
});

// Production build
// ============================================================================
gulp.task('clean', function (cb) {
    return del(['dist'], cb);
});

gulp.task('build', ['clean'], function () {
    return gulp.src('src/elasticslider.js')
        .pipe(concat('elasticslider.min.js'))
        .pipe(babel())
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist'))
});

gulp.task('serve', ['js', 'watch']);
gulp.task('default', ['build']);
