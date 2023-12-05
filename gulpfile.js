/*------------------------------------*\
  #CONNECTIONS
\*------------------------------------*/

const gulp = require('gulp'); // подключаем gulp
const concatCSS = require('gulp-concat-css'); // подключаем gulp-concat-css
const plumber = require('gulp-plumber'); // подключаем gulp-plumber
const del = require('del'); // подключаем del
const browserSync = require('browser-sync').create(); // подключаем browser-sync
const postcss = require('gulp-postcss'); // подключаем gulp-postcss
const autoprefixer = require('autoprefixer'); // подключаем autoprefixer
const mediaquery = require('postcss-combine-media-query') // подключаем postcss-combine-media-query
const cssnano = require('cssnano') // подключаем cssnano
const htmlMinify = require('html-minifier') // подключаем html-minifier





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
  const options = {
    /**
     * Настройки для плагина html-minifer
     */
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true
  };
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .on('data', function(file) {
      const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
      return file.contents = buferFile
    })
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
    /**
     * autoprefixer - этот плагин смотрит browserslist внутри package.json
     * и подставляет вендорные префиксы для браузеров, которым они нужны
     * 
     * mediaquery (postcss-combine-media-query) - находит все медиазапросы
     * с одинаковым параметрами в исходниках и склеивает их в один медиазапрос при сборке
     * 
     * cssnano - минификация сборки
     */
    autoprefixer(),
    mediaquery(),
    cssnano()
  ]
  return gulp.src('src/**/*.css')
    .pipe(plumber())
    .pipe(concatCSS('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.reload({stream: true}));
}

function assets() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('build/images'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('build');
}

function watchFiles() {
  gulp.watch(['./src/**/*.html'], html);
  gulp.watch(['./src/**/*.css'], css);
  gulp.watch(['./src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], assets);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './build'
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
 * gulp html - переносит все html-файлы из src/ в build/
 * gulp css - склеивает все css-файлы в bundle.css и переносит из src/ в build/
 * gulp assets - переносит все изображения из src/images в build/images
 * gulp clean - удаляет папку build/
 * 
 * gulp build - сперва выполняет удаление build/, а потом преобразование
 * и файлов из src/ в новую (очищенную) build/
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