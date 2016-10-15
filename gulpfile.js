const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const chug = require('gulp-chug');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('ehehe', function() {
  gulp.src('node_modules/angular/angular.js')
    .pipe(gulp.dest('src/public/node_modules/angular'));
  gulp.src('node_modules/chart.js/Chart.min.js')
    .pipe(gulp.dest('src/public/node_modules/chart.js'));
  gulp.src('node_modules/angular-chart.js/dist/angular-chart.min.js')
    .pipe(gulp.dest('src/public/node_modules/angular-chart.js/dist'));
});
