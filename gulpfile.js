const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const chug = require('gulp-chug');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const resources = [
  'node_modules/angular/angular.js',
  'node_modules/chart.js/dist/Chart.min.js',
  'node_modules/angular-chart.js/dist/angular-chart.min.js',
];

gulp.task('ehehe', function() {
  gulp.src(resources)
    .pipe(gulp.dest('src/public/resources'));
});
