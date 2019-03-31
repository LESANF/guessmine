import gulp from "gulp";
import sass from "gulp-sass";
import uglify from "gulp-uglify";
import del from "del";
import autoprefixer from "gulp-autoprefixer";
import bro from "gulp-bro";
import minifyCSS from "gulp-csso";
import babelify from "babelify";

sass.compiler = require("node-sass");

const paths = {
  js: {
    watch: "assets/js/**/*.js",
    src: "assets/js/main.js",
    dest: "src/public/js/"
  },
  scss: {
    watch: "assets/scss/**/*.scss",
    src: "assets/scss/styles.scss",
    dest: "src/public/css/"
  }
};

export const clean = () => del(["src/public"]);

function scripts() {
  return gulp
    .src(paths.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({
            presets: ["@babel/preset-env"],
            plugins: ["babel-plugin-transform-es2015-modules-commonjs"]
          })
        ]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest));
}

function styles() {
  return gulp
    .src(paths.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ browsers: ["last 2 versions"], cascade: false }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.scss.dest));
}

function watchFiles() {
  gulp.watch(paths.js.watch, scripts);
  gulp.watch(paths.scss.watch, styles);
}

const dev = gulp.series(clean, scripts, styles, watchFiles);

export default dev;
