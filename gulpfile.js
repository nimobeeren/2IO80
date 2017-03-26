'use strict';

const gulp = require('gulp');

// css
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const moduleImporter = require('sass-module-importer');

// svg
const svgSymbols = require('gulp-svg-symbols');
const svgmin = require('gulp-svgmin');

// server
const notify = require("gulp-notify");
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const styleguide = require('sc5-styleguide');

const sassSettings = {
    importer: moduleImporter()
}
const outputPath = 'styleguide-output';

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
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

gulp.task('icons', function () {
    return gulp.src('public/icons/*.svg')
        .pipe(svgmin())
        .pipe(svgSymbols({
            templates: ['default-svg']
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('icons-watch', ['icons'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['serve']);
gulp.task('serve', ['sass', 'icons', 'browser-sync']);

var nodemonInstance;

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:80",
        port: 7000,
        browser: []
	});

    gulp.watch('public/icons/*.svg', ['icons-watch']);
    gulp.watch('public/scss/**/*.scss', ['sass']);
    gulp.watch('views/**/*.*').on('change', function(){
        nodemonInstance.emit("restart");
    });
});

gulp.task('nodemon', function (cb) {
	var started = false;

	nodemonInstance = nodemon({
		script: 'server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});

    return nodemonInstance;
});

gulp.task('styleguide:generate', function() {
    return gulp.src('public/scss/**/*.scss')
      .pipe(styleguide.generate({
          title: 'My Styleguide',
          server: true,
          rootPath: outputPath,
          overviewPath: 'README.md'
        }))
      .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide:applystyles', function() {
    return gulp.src('public/scss/style.scss')
      .pipe(sass(sassSettings))
      .pipe(styleguide.applyStyles())
      .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide', ['styleguide:static', 'styleguide:generate', 'styleguide:applystyles']);

gulp.task('styleguide:static', function() {
  gulp.src(['public/scss/**/*.scss'])
      .on('error', notify.onError(function (error) {
          return error.message;
      }))
    .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide:serve', ['styleguide'], function() {
  // Start watching changes and update styleguide whenever changes are detected
  gulp.watch('public/scss/**/*.scss', ['styleguide']);
});
