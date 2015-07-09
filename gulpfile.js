'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');

var dirs = ['fab-dialog', 'wave', 'planner', 'slider', 'bar-line_graph'];

gulp.task('sass', function () {
	dirs.map(function (dir) {
		gulp.src(dir + '/*.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest('./' + dir));
	});
});

gulp.task('watch', function() {
	var watchDir = dirs.map(function (dir) {
		return dir + '/*.scss';
	});
	watch(watchDir, function() {
		gulp.run(['sass']);
	});
});