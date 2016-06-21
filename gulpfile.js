'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
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
            'src/elasticslider.js',
        ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('elasticslider-core.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/'));
});

gulp.task('watch', function () {
    gulp.watch('src/elasticslider.js', ['js']);
});

// Dist build
// ============================================================================
gulp.task('dist:clean', function (cb) {
    return del(['dist'], cb);
});

gulp.task('dist:build', ['dist:clean'], function () {
    return gulp.src('src/elasticslider.js')
        .pipe(concat('elasticslider-core.min.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist'))
});

// Test
// ============================================================================
gulp.task('connect', function() {
    connect.server({
        port: 5000,
        root: './src',
        livereload: false
    });
});

// Tasks
// ============================================================================
gulp.task('serve', ['js', 'connect', 'watch']);
gulp.task('test', ['js', 'connect']);
gulp.task('default', ['dist:build']);
