var browserSync = require('browser-sync');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var cssbeautify = require('gulp-cssbeautify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var snippets = require('sass-snippets');
var del = require('del');

var watchSassFiles = 'scss/**/*.+(sass|scss)';
var watchJsFiles = ['js/**/*.js', '!js/libs/*.js'];
var delJsFiles = ['js/**/*min.js', '!js/libs/*.js'];
var watchHtmlFiles = '**/*.html';

// Browser Synk
gulp.task('browser-sync', function() {
	browserSync({ server: true, notify: false });
});

// Слежение за JS
gulp.task('dev-js', function() {
	return gulp.src(watchJsFiles)
		.pipe(browserSync.reload({stream: true}));
});

// SASS Компиляция
gulp.task('dev-sass', function() {
	return gulp.src(watchSassFiles)
		.pipe(sass({
			includePaths: snippets.includePaths
		}).on('error', notify.onError())) // Преобразование sass в css
		.pipe(autoprefixer(['last 15 versions'])) // Добавление префиксов
		.pipe(cssbeautify({indent: '	'})) // Форматирование кода
		.pipe(gulp.dest('css')) // Перемещение в папку css
		.pipe(browserSync.reload({stream: true})); // Обновление страницы
});

gulp.task('watch', ['dev-sass', 'dev-js', 'browser-sync'], function() {
	gulp.watch(watchSassFiles, ['dev-sass']);
	gulp.watch(watchJsFiles, ['dev-js']);
	gulp.watch(watchHtmlFiles, browserSync.reload);
});

// Удаление минифицированного джса
gulp.task('clean', function() {
	return del.sync(delJsFiles);
});

// Сжатие js
gulp.task('build-js', function() {
	return gulp.src(watchJsFiles)
		.pipe(uglify()) // Минификация кода
		.pipe(rename({suffix: '.min', prefix : ''})) // Добавление суффикса .min к названию файла
		.pipe(gulp.dest('js')); // Перемещение в папку js
});

// Сжатие css
gulp.task('build-sass', function() {
	return gulp.src(watchSassFiles)
		.pipe(sass({
			includePaths: snippets.includePaths
		}).on('error', notify.onError())) // Преобразование sass в css
		.pipe(autoprefixer(['last 15 versions'])) // Добавление префиксов
		.pipe(cleanCSS()) // Минификация кода
		.pipe(rename({suffix: '.min', prefix : ''})) // Добавление суффикса .min к названию файла
		.pipe(gulp.dest('css')); // Перемещение в папку css
});

// Компиляция
gulp.task('build', ['clean', 'build-sass', 'build-js']);
gulp.task('default', ['watch']);
