'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const webserver = require("gulp-webserver");
const babel = require('gulp-babel');
const del = require('del');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const pkg = require('./package.json');
const banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

// Develop build
// =============================================================================
gulp.task('js', () => {
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

gulp.task('watch', () => {
    gulp.watch('src/elasticslider.js', ['js']);
});

// Dist build
// =============================================================================
gulp.task('dist:clean', cb => del(['dist'], cb));

gulp.task('dist:build', ['dist:clean'], () => {
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
// =============================================================================
gulp.task('server', () => {
  return gulp.src('./src')
      .pipe(webserver({
          livereload: false,
          fallback: 'demo.html',
          port: 5000,
          open: true,
      }));
});

// Tasks
// =============================================================================
gulp.task('serve', ['js', 'server', 'watch']);
gulp.task('test', ['js', 'server']);
gulp.task('default', ['dist:build']);
