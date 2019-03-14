// Links to dependencies in node_modules folder to run plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
// const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer')

gulp.task('styles', () => {
    return gulp.src('./dev/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles'))
});

// gulp.task('bs', () => {
//     browserSync.init({
//         server: {
//             baseDir: './'
//         }
//     });
// });

// This doesn't work anymore (it worked for gulp 3)
// gulp.task('watch', function () {
//     gulp.watch('./dev/styles/**/*.scss', ['styles']);
//     gulp.watch('./dev/scripts/main.js', ['scripts']);
// });

// Now in v4, you have to pass a function
gulp.task('watch', function () {
    gulp.watch('./dev/styles/**/*.scss', gulp.series('styles'));
    // gulp.watch('./dev/scripts/main.js', gulp.series('scripts'));
});

