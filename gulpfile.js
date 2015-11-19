'use strict';

var gulp = require( 'gulp' );
var karma = require( 'karma' ).server;
var jshint = require( 'gulp-jshint' );
var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglify' );
var header = require( 'gulp-header' );
var jscs = require( 'gulp-jscs' );
var plato = require( 'plato' );
var exec = require( 'child_process' ).exec;
var pkg = require( './package.json' );

var coreFiles = 'src/**/*.js';
var allFiles = '{test,src}/**/*.js';

function banner() {
  return [
    '/**!',
    ' * <%= pkg.name.replace("@fdaciuk/", "") %> - v<%= pkg.version %>',
    ' * <%= pkg.description %>',
    ' * <%= pkg.homepage %>',
    '',
    ' * <%= new Date( Date.now() ) %>',
    ' * <%= pkg.license %> (c) <%= pkg.author %>',
    '*/',
    ''
  ].join( '\n' );
}

gulp.task( 'lint', function() {
  gulp.src( allFiles )
    .pipe( jshint() )
    .pipe( jshint.reporter( 'default' ) );

  gulp.src( allFiles )
    .pipe( jscs() )
    .on( 'error', function( err ) {
      var ERROR_CODE = 1;
      console.log( err.toString() );
      process.exit( ERROR_CODE );
    });
});

gulp.task( 'uglify', function() {
  gulp.src( coreFiles )
    .pipe( concat( 'ajax.min.js' ) )
    .pipe( uglify() )
    .pipe( header( banner(), { pkg: pkg } ) )
    .pipe( gulp.dest( './dist' ) );
});

gulp.task( 'test', function( done ) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done );
});

gulp.task( 'webserver', function( done ) {
  require( './api/app' );
  exec( 'pkill -9 python && python -m SimpleHTTPServer 9001', function() {
    console.log( 'Server listen on port 9001' );
    done();
  });
});

gulp.task( 'watch', [ 'test', 'lint' ], function() {
  gulp.watch( '{test,src}/**/*.js', [ 'test', 'lint' ]);
});

gulp.task( 'deploy', function( done ) {
  console.log( 'Deploying...' );

});

gulp.task( 'default', [ 'webserver', 'watch' ]);
