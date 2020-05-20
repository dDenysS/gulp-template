const gulp = require('gulp')

const imageMinify = require('./imageMinify')
const svgSprite = require('./svgSprite')
const styles = require('./styles')
const pug2html = require('./pug2html')
const script = require('./script')
const copyDependencies = require('./copyDependencies')

const server = require('browser-sync').create()

function readyReload(cb) {
  server.reload()
  cb()
}

module.exports = function serve(cb) {
    server.init({
        server: 'build',
        notify: false,
        open: true,
        cors: true
    })

    gulp.watch('src/img/*.{gif,png,jpg,svg,webp}', gulp.series(imageMinify, readyReload))
    gulp.watch('src/img/sprite/*.svg', gulp.series(svgSprite, readyReload))
    gulp.watch('src/styles/**/*.scss', gulp.series(styles, cb => gulp.src('build/css').pipe(server.stream()).on('end', cb)))
    gulp.watch('src/js/**/*.js', gulp.series(script, readyReload))
    gulp.watch('src/pages/**/*.pug', gulp.series(pug2html, readyReload))

    gulp.watch('package.json', gulp.series(copyDependencies, readyReload))

    return cb()
}
