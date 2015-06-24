'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

var dirs = ['fab-dialog', 'wave'];

gulp.task('sass', function () {
	gulp.src(dirs.map(function (dir) {
		return dir + '/*.scss';
	}))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./fab-dialog'));
});

gulp.task('watch', function() {
	var watchDir = [];
	dirs.map(function (dir) {
		watchDir.push(dir + '/*.js');
		watchDir.push(dir + '/*.scss');
		watchDir.push(dir + '/*.html');
	});
	watch(['wave/*.js', 'wave/*.scss', 'wave/*.html'], function() {
		gulp.run(['sass']);
	});
});