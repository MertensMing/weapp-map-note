const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

const entry = [
  'src/**/*.scss',
];

gulp.task('sass', function () {
  return gulp.src(entry)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename((path) => path.extname = '.wxss'))
    .pipe(gulp.dest(file => file.base));
});

gulp.task('sass:watch', function () {
  gulp.watch(entry, ['sass']);
});