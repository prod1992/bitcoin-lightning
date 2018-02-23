(function () {

    'use strict';

    var path = require('path');
    var gulp = require('gulp');
    var conf = require('./conf');
    var purifyCss = require("purify-css");
    var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
    });
    var critical = require("critical").stream;
    var gutil = require("gulp-util");

    function htmlTask() {

        var htmlFilter = $.filter('*.html', {restore: true, dot: true});
        var jsFilter = $.filter('**/*.js', {restore: true, dot: true});
        var cssFilter = $.filter('**/*.css', {restore: true, dot: true});

        return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
            .pipe($.useref())
            .pipe(jsFilter)
            .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
            // .pipe($.rev())
            // .pipe($.sourcemaps.write('maps'))
            .pipe(jsFilter.restore)
            .pipe(cssFilter)
            .pipe($.cleanCss({processImport: false}))
            // .pipe($.rev())
            // .pipe($.sourcemaps.write('maps'))
            .pipe(cssFilter.restore)
            .pipe($.revReplace())
            .pipe(htmlFilter)
            .pipe($.htmlmin({
                removeEmptyAttributes: true,
                removeAttributeQuotes: true,
                collapseBooleanAttributes: true,
                collapseWhitespace: true
            }))
            .pipe(htmlFilter.restore)
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
            .pipe($.size({title: path.join(conf.paths.dist, '/'), showFiles: true}))

    }


    // Generate & Inline Critical-path CSS

    gulp.task('other', function () {
        var fileFilter = $.filter(function (file) {
            return file.stat.isFile();
        });

        return gulp.src([
            path.join(conf.paths.favicons, '/**/*.{ico,png}'),
            path.join(conf.paths.src, '/_assets/**/*'),
            path.join('!' + conf.paths.src, '/_assets/**/*.{html,css,js,scss}')
        ])
            .pipe(fileFilter)
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
    });

    gulp.task('clean', function () {
        return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
    });

    gulp.task('html', ['inject'], htmlTask);

    gulp.task('build', ['html', 'other', 'images', 'fonts', 'purifycss', 'critical', 'cssfinalminify']);

    gulp.task('critical', ['html'], function () {
        return gulp.src(path.join(conf.paths.dist, '/*.html'))
            .pipe(critical({
                base: path.join(conf.paths.dist, '/'),
                inline: true,
                extract: true,
                assetPaths: ['images', 'fonts'],
                ignore: ['@font-face']
            }))
            .on('error', function (err) {
                gutil.log(gutil.colors.red(err.message));
            })
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
    });

    gulp.task('purifycss', ['critical'], function () {
        var content = [
            path.join(conf.paths.dist, '/**/*.{js,html}')
        ];
        var css = [path.join(conf.paths.dist, '/styles/*.css')];
        purifyCss(content, css, { info: true, rejected: true}, function(res) {
            console.info('purified', res);
        });
    });

    gulp.task('cssfinalminify', ['purifycss'], function () {
        return gulp.src(path.join(conf.paths.dist, '/styles/*.css'))
            .pipe($.cleanCss({debug: true}, (details) => {
                console.log(`${details.name}: ${details.stats.originalSize}`);
                console.log(`${details.name}: ${details.stats.minifiedSize}`);
            }))
            .pipe(gulp.dest(path.join(conf.paths.dist, '/styles/')))
            .pipe($.size({title: path.join(conf.paths.dist, '/styles/'), showFiles: true}));
    });


})();