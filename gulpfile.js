const gulp = require("gulp")
const sass = require("gulp-sass")
const postcss = require("gulp-postcss")
const autoprefixer = require("autoprefixer")
const cssnano = require("cssnano")
const sourcemaps = require("gulp-sourcemaps")
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel")

const paths = {
    styles: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "dev/styles/**/*.scss",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "public/styles"
    },

    scripts: {
        src: "dev/scripts/**/*.js",
        dest: "public/scripts"
    }

    // Easily add additional paths
    // ,html: {
    //  src: '...',
    //  dest: '...'
    // }
};

function style() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// A simple task to reload the page
function reload() {
    browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./"
         }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.scripts.src, scripts);
    // We should tell gulp which files to watch to trigger the reload
    // This can be html or whatever you're using to develop your website
    // Note -- you can obviously add the path to the Paths object
    //gulp.watch("src/*.html", reload);
    gulp.watch("./*.html").on('change', browserSync.reload);
}

// We don't have to expose the reload function
// It's currently only useful in other functions

// Don't forget to expose the task!
exports.watch = watch

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;
exports.scripts = scripts;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(style, scripts, watch);

/*
 * You can still use `gulp.task` to expose tasks
 */
//gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);

// This gulpfile was inspired by https://levelup.gitconnected.com/how-to-setup-your-workflow-using-gulp-v4-0-0-5450e3d7c512

