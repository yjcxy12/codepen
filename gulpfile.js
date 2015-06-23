'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

gulp.task('sass', function () {
	gulp.src('wave/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./wave'));
});

gulp.task('watch', function() {
	watch(['wave/*.js', 'wave/*.scss', 'wave/*.html'], function() {
		gulp.run(['sass']);
	});
});