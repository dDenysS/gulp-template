const gulp = require('gulp')
const imagemin = require('gulp-imagemin')

module.exports = function imageMinify() {
  return gulp.src('src/img/*.{gif,png,jpg,svg,webp}')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'))
}

