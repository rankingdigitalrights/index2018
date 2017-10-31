var fs = require('fs');
var gulp = require('gulp');
var cp = require('child_process');
var path = require('path');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var envify = require('envify/custom');
var babelify = require('babelify');
var jstify = require('jstify');


////////////////////////////////////////////////////////////////////////////////
//--------------------------- Variables --------------------------------------//
//----------------------------------------------------------------------------//

// The package.json
var pkg;
var shouldReload = true;
var jekyllLimit = null;
var environment = 'development';

////////////////////////////////////////////////////////////////////////////////
//------------------------- Helper functions ---------------------------------//
//----------------------------------------------------------------------------//

function readPackage () {
  pkg = JSON.parse(fs.readFileSync('package.json'));
}
readPackage();

////////////////////////////////////////////////////////////////////////////////
//-------------------------- Copy tasks --------------------------------------//
//----------------------------------------------------------------------------//

// Copy from the .tmp to _site directory.
// To reduce build times the assets are compiles at the same time as jekyll
// renders the site. Once the rendering has finished the assets are copied.
gulp.task('copy:assets', function(done) {
  return gulp.src('.tmp/assets/**')
    .pipe(gulp.dest('_site/assets'));
});

////////////////////////////////////////////////////////////////////////////////
//------------------------- Browserify tasks ---------------------------------//
//------------------- (Not to be called directly) ----------------------------//
//----------------------------------------------------------------------------//

// Compiles the user's script files to bundle.js.
gulp.task('javascript', function () {

  var b = browserify({
    entries: ['./app/assets/scripts/main.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true,
  });

  b.transform(babelify);
  b.transform(jstify);
  b.transform(envify({
    NODE_ENV: environment,
    global: true
  }));

  var watcher = watchify(b);

  function bundler () {
    return watcher.bundle()
      .on('error', function (e) {
        notifier.notify({
          title: 'Oops! Browserify errored:',
          message: e.message
        });
        console.log('Sass error:', e);
        // Allows the watch to continue.
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      // Source maps.
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/assets/scripts'))
      .pipe(reload({stream: true}));
  }

  watcher
  .on('log', gutil.log)
  .on('update', bundler);

  return bundler();
});

////////////////////////////////////////////////////////////////////////////////
//--------------------------- Assets tasks -----------------------------------//
//----------------------------------------------------------------------------//

gulp.task('styles', function() {
  return gulp.src('app/assets/styles/main.scss')
    .pipe(plumber(function (e) {
      notifier.notify({
        title: 'Oops! Sass errored:',
        message: e.message
      });
        console.log('Sass error:', e.toString());
        // Allows the watch to continue.
        this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: require('node-neat').includePaths,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/styles'))
    .pipe(reload({stream: true}));
});

// Build the jekyll website.
gulp.task('jekyll', function (done) {
  var args = ['exec', 'jekyll', 'build'];

  switch (environment) {
    case 'development':
      args.push('--config=_config.yml,_config-dev.yml');
    break;
    case 'stage':
      args.push('--config=_config.yml,_config-stage.yml');
    break;
    case 'production':
      args.push('--config=_config.yml');
    break;
  }


  if (jekyllLimit != null) {
    args.push('--limit_posts=' + jekyllLimit);
  }

  return cp.spawn('bundle', args, {stdio: 'inherit'})
    .on('close', done);
});

////////////////////////////////////////////////////////////////////////////////
//--------------------------- Callable tasks ---------------------------------//
//----------------------------------------------------------------------------//

// Builds the website, watches for changes and starts browserSync.
gulp.task('serve', ['build'], function() {
  browserSync({
    port: 3000,
    server: {
      baseDir: ['.tmp', '_site'],
      routes: {
        '/node_modules': './node_modules'
      }
    }
  });

  gulp.watch('app/assets/styles/**/*.scss', function() {
    runSequence('styles');
  });

  gulp.watch(['app/**/*.html', 'app/**/*.md', 'app/**/*.json', 'app/**/*.geojson'], function() {
    runSequence('jekyll', 'copy:assets', browserReload);
  });

});

////////////////////////////////////////////////////////////////////////////////
//------------------------- Environment tasks --------------------------------//
//----------------------------------------------------------------------------//

// Main build task
// Builds the site. Destination --> _site
gulp.task('build', function(done) {
  runSequence(['jekyll', 'javascript', 'styles'], ['copy:assets'], done);
});

// Default task.
// Builds the website, watches for changes and starts browserSync.
gulp.task('default', function(done) {
  runSequence('build', function() {
    process.exit(0);
    done();
  });
});

gulp.task('prod', function(done) {
  environment = 'production';
  runSequence('build', function() {
    process.exit(0);
    done();
  });
});

gulp.task('stage', function(done) {
  environment = 'stage';
  runSequence('build', function() {
    process.exit(0);
    done();
  });
});

gulp.task('limit', function(done) {
  if (process.argv[3] == '-n') {
    jekyllLimit = process.argv[4];
  }
  runSequence('serve', done);
});

// Removes temp folders.
gulp.task('clean', function() {
  return gulp.src(['_site', '.tmp/'], {read: false})
    .pipe(clean());
});

////////////////////////////////////////////////////////////////////////////////
//------------------------- Helper functions ---------------------------------//
//----------------------------------------------------------------------------//

function browserReload() {
  if (shouldReload) { reload(); }
}
