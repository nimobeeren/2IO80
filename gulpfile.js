'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const moduleImporter = require('sass-module-importer');
const gls = require('gulp-live-server');
const notify = require("gulp-notify");

const sassSettings = {
    importer: moduleImporter()
}

gulp.task('sass', () => {
    return gulp.src('./public/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassSettings)
            .on('error', notify.onError(function (error) {
                return error.message;
            }))
        )
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('default', ['sass', 'icons']);

gulp.task('serve', function() {
    var server = gls.new('server.js');
    // var server = gls.static(['views', 'public']);
    server.start();

    gulp.watch(['./public/scss/**/*.scss', './views/**/*.html'], ['sass'], function (file) {
        console.log("reloaded!!!!");
        server.notify.apply(server, [file]);
    });

    //
    // gulp.watch(['views/**/*.html', 'public/**/*.css'], function (file) {
    //   server.notify.apply(server, [file]);
    // });
});
