const gulp        = require('gulp');
const fileinclude = require('gulp-file-include');
const server = require('browser-sync').create();
const { watch, series } = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');

const paths = {
  scripts: {
    src: './',
    dest: './build/',
    assets: './build/assets/',
  }
};

// Reload Server
async function reload() {
  server.reload();
}

// Sass compiler
async function compileSass() {
  gulp.src('./src/styles/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
}

// Copy assets after build
async function copyAssets() {
  gulp.src(['assets/**/*'])
    .pipe(gulp.dest(paths.scripts.assets));
}

// Js compiler
async function compilerJs() {
  gulp.src(['src/js/app.js'])
    .pipe(babel())
    .pipe(gulp.dest('./assets/js'));
}


// Build files html and reload server
async function buildAndReload() {
  await includeHTML();
  await copyAssets();
  reload();
}

async function includeHTML(){
  return gulp.src([
    'src/html/*.html',
    '!src/html/__root/*.html', // ignore
    '!src/html/_partials/*.html', // ignore
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}
exports.includeHTML = includeHTML;

exports.default = async function() {
  // Init serve files from the build folder
  server.init({
    port: 3200,
    ui: false,
    server: {
      baseDir: paths.scripts.dest
    },
    middleware: [
      {
        route: "/",
        handle: function (req, res, next) {
          res.writeHead(301, { Location: '/index.html' });
          res.end();
        }
      }
    ]
  });
  // Build and reload at the first time
  buildAndReload();

  // Watch Js task
  watch('./src/js/app.js', series(compilerJs));
  // Watch Sass task
  watch('./src/styles/**/*.scss',  series(compileSass));
  // Watch task
  watch(["./src/html/**/*.html", "assets/**/*"], series(buildAndReload));
};