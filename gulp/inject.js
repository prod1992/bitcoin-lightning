'use strict';

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');
const $ = require('gulp-load-plugins')();
const _ = require('lodash');
const browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function () {
    browserSync.reload();
});

function injectTask() {
    let injectStyles = gulp.src([
        path.join(conf.paths.tmp, '/serve/css/**/*.css')
    ], {read: false});

    let injectScripts = gulp.src([
        path.join(conf.paths.tmp, '/serve/js/**/*.js')
    ]);


    let injectOptions = {
        ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.src, '/*.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
}

gulp.task('inject', ['scripts', 'styles'], injectTask);
