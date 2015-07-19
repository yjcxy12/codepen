'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var react = require('gulp-react');

var dirs = [
	'fab-dialog', 
	'wave', 
	'planner', 
	'slider', 
	'bar-line_graph', 
	'random-quote', 
	'weather-app', 
	'twitch-channels'
];

var jsx_dirs = [
	'twitch-channels'
];

gulp.task('sass', function () {
	dirs.map(function (dir) {
		gulp.src(dir + '/*.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest('./' + dir));
	});
});

gulp.task('jsx', function () {
	jsx_dirs.map(function (dir) {
		gulp.src(dir + '/**/*.jsx')
			.pipe(react())
			.pipe(gulp.dest('./' + dir));
		});
});

gulp.task('watch', function() {
	var watchDir = dirs.map(function (dir) {
		return dir + '/*.scss';
	});
	watchDir.concat(jsx_dirs.map(function (dir) {
		return dir + '/*.jsx';
	}));
	watch(watchDir, function() {
		gulp.run(['sass']);
	});
});

gulp.task('default', ['sass', 'jsx']);