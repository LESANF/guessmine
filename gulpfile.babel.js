import gulp from "gulp";
import sass from "gulp-sass";
import uglify from "gulp-uglify";
import del from "del";
import autoprefixer from "gulp-autoprefixer";
import images from "gulp-image";
import minifyCSS from "gulp-csso";
import babel from "gulp-babel";

sass.compiler = require("node-sass");

const paths = {
  js: {
    src: "assets/js/main.js",
    dest: "src/public/js/"
  },
  scss: {
    src: "assets/scss/**/*.scss",
    dest: "src/public/css/"
  }
};

export const clean = () => del(["src/public"]);

function scripts() {
  return gulp
    .src(paths.js.src)
    .pipe(babel())
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
  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.scss.src, styles);
}

const dev = gulp.series(clean, scripts, styles, watchFiles);

export default dev;
