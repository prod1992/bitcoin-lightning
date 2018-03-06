(function() {
    'use strict';

    const path = require('path');
    const gulp = require('gulp');
    const conf = require('./conf');
    const browserSync = require('browser-sync');
    const $ = require('gulp-load-plugins')();
    const _ = require('lodash');

    gulp.task('styles-reload', ['styles'], function() {
        return buildStyles()
            .pipe(browserSync.stream());
    });

    gulp.task('styles', function() {
        return buildStyles();
    });

    let buildStyles = function() {
        let sassOptions = {
            style: 'compressed',
            outputStyle: 'compressed',
            importer: require('sass-module-importer')()
        };

        let injectFiles = gulp.src([
            path.join(conf.paths.src, '/_assets/stylesheets/**/*.scss'),
            path.join('!' + conf.paths.src, '/_assets/stylesheets/index.scss')
        ], { read: false });

        let injectOptions = {
            transform: function(filePath) {
                filePath = filePath.replace(conf.paths.src + '/_assets/stylesheets/', '');
                //do not import .scss file starting with _
                if (path.basename(filePath).indexOf('_') === 0) {
                    return '';
                }
                return '@import "' + filePath + '";';
            },
            starttag: '// injector',
            endtag: '// endinjector',
            addRootSlash: false
        };


        return gulp.src([
            path.join(conf.paths.src, '/_assets/stylesheets/index.scss')
        ])
            .pipe($.inject(injectFiles, injectOptions))
            .pipe($.sourcemaps.init())
            .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
            .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/css/')));
    };
})();