/*------------------------------------*\
  #CONNECTIONS
\*------------------------------------*/

const gulp = require('gulp'); // подключаем gulp
const concatCSS = require('gulp-concat-css'); // подключаем gulp-concat-css
const plumber = require('gulp-plumber'); // подключаем gulp-plumber
const del = require('del'); // подключаем del
const browserSync = require('browser-sync').create(); // подключаем browser-sync





/*------------------------------------*\
  #TASKS
\*------------------------------------*/

/**
 * Тут нужно описать, что делает функция
 * Встроенный в Gulp метод src(), умеет искать файлы
 * pipe позволяет разбивать функции на шаги
 * Метод plumber() позволит сделать сборку, в случае если будут ошибки
 * Метод dest() отвечает за отправку файла в точку назначения
 * Метод watch() позволяет следить за изменениями в файлах
 */

function html() {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function css() {
  return gulp.src('src/**/*.css')
    .pipe(plumber())
    .pipe(concatCSS('bundle.css'))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function assets() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['./src/**/*.html'], html);
  gulp.watch(['./src/**/*.css'], css);
  gulp.watch(['./src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], assets);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}





/*------------------------------------*\
  #COMMANDS
\*------------------------------------*/

/**
 * Встроенный в Gulp метод series() - выполняет задачи по очереди
 * Встроенный в Gulp метод parallel() - выполняет задачи параллельно
 */

/**
 * gulp html - переносит все html-файлы из src/ в dist/
 * gulp css - склеивает все css-файлы в bundle.css и переносит из src/ в dist/
 * gulp assets - переносит все изображения из src/images в dist/images
 * gulp clean - удаляет папку dist/
 * 
 * gulp build - сперва выполняет удаление dist/, а потом преобразование
 * и файлов из src/ в новую (очищенную) dist/
 * 
 * gulp watchApp - следит за файлами в src/ и делает пересборку
 * после каждого изменения этих файлов
 */

exports.html = html;
exports.css = css;
exports.css = css;
exports.clean = clean;

const build = gulp.series(clean, gulp.parallel(html, css, assets));
exports.build = build;

exports.watchApp = gulp.parallel(build, watchFiles, serve);