'use strict';

const conf = require('./conf');
const path = require('path');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const babel = require('babelify');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const $ = require('gulp-load-plugins')();
const gutil = require('gulp-util');

gulp.task('scripts-reload', function () {

    buildScripts(function() {
        browserSync.reload();
    });
});

function scriptsTask() {

    buildScripts();
}

function buildScripts(watch) {

    let bundler = browserify('./src/js/main.js', {debug: true}).transform(babel);

    function rebuildScripts() {
        return bundler
            .bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('all.min.js'))
            .pipe(buffer())
            .pipe($.uglify())
            .pipe(gulp.dest('./.tmp/serve/js/'));
    }

    if (watch) {
        bundler.on('update', function () {
            console.log('-> bundling...');
            rebuildScripts();
        });
    }

    rebuildScripts();
}

gulp.task('scripts', scriptsTask);
