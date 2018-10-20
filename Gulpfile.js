var gulp = require("gulp"),
    sass = require("gulp-sass"),
    concat = require("gulp-concat"),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    minifyEjs = require("gulp-minify-ejs"),
    stripEJSComments = require('gulp-strip-comments'),
    nodemon = require('gulp-nodemon'),
    plumber = require("gulp-plumber"),
    uglify = require("gulp-uglify");


//Build task 
gulp.task("build", ["ejs", "styles", "images", "javascript", "routes"], function () {
  console.log("Build Success");
});


//Creates a browser-sync proxy
gulp.task('init', ["nodemon"], function () {
  browserSync.init({
    proxy: 'http://localhost:3000', //APP.js port number - Listens On This Port
    port: 3128, //Browser Sync Port  - Actually Running On 3000 but proxy browser sync runs on 3128
    serveStatic: [ './public/'], // Starting Point For Gulpfile -  (ESSENTIAL PART, WONT WORK WITHOUT IT)
    reloadOnRestart: true, // auto-reload all browsers following a Browsersync reload 
    ghostMode:false,
    open: "external",
    https: true
  });
});

//Starts the express server
gulp.task('nodemon', function (done) {
  let running = false; //Default State

  return nodemon({
    script: 'index.js', //Index file for the JS project
    watch: ["./assets/", "./public/"] //What nodemon has access to
  })

  .on('start', function () {
    if (!running) {
      done();
    }
    running = true;
  })

  .on('restart', function () {
    setTimeout(function () {
      reload();
    }, 500);
  });
});

//SCSS Task
gulp.task("styles", function () {
  return gulp.src("./assets/stylesheet/APP.scss")
  .pipe(plumber())
  .pipe(sass({
    outputStyle: 'compressed'
  }))
  .pipe(gulp.dest("./public/stylesheet/"))
  .pipe(browserSync.stream({ stream: true }));
});

//Compiles the express route/s
gulp.task("routes", function () {
   return gulp.src([
        "./assets/routes/*.js"
   ])
   .pipe(plumber())
   .pipe(gulp.dest("./public/routes/"))
   .pipe(browserSync.stream({ stream: true }));
});


//Image minification
gulp.task("images", function () {
  gulp.src("./assets/images/*")
  .pipe(gulp.dest("./public/images"))
  .pipe(browserSync.stream({ stream: true }));
});

//Client javascript
gulp.task("javascript", function () {
  gulp.src([
    "./node_modules/jquery/dist/jquery.js",
    "./node_modules/tether/dist/js/tether.js",
    "./node_modules/bootstrap/dist/js/bootstrap.js",
    "./assets/scripts/*.js"
  ])
  .pipe(plumber())
  .pipe(concat("main.js"))
  .pipe(uglify())
  .pipe(gulp.dest("./public/scripts/"))
  .pipe(browserSync.stream({ stream: true }));
});

//EJS task
gulp.task("ejs", function () {
    gulp.src("./assets/views/**/*.ejs")
    .pipe(plumber())  
    .pipe(stripEJSComments())
    .pipe(minifyEjs({}))
    .pipe(gulp.dest("./public/views"))
    .pipe(browserSync.stream({ stream: true }));
});


//Default task array
gulp.task("default", ["init", "build"], function (done) {
  gulp.watch("./assets/stylesheet/**/*.scss", ["styles"]);
  gulp.watch("./assets/scripts/*", ["javascript"]);
  gulp.watch("./assets/routes/*.js", ["routes"]);
  gulp.watch("./assets/images/*",["images"]);
  gulp.watch("./assets/views/**/*.ejs",["ejs"]);
});