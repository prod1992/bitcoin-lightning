'use strict';

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');
const browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject', 'fonts'], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'package.json'], ['inject-reload']);

  gulp.watch([
    path.join(conf.paths.src, '/**/*.css'),
    path.join(conf.paths.src, '/**/*.scss')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/**/*.js'), function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});
