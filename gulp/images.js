'use strict';

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');
const imagemin = require('gulp-imagemin');


// move fonts
gulp.task('images', function () {

    gulp.src(path.join(conf.paths.src, '/_assets/images/**/*.{svg}'))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/images')));

    return gulp.src([
        path.join(conf.paths.src, '/_assets/images/**/*')
    ])
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/images')))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/images')));
});

