'use strict';

var gulp = require('gulp');

var nodemon = require('gulp-nodemon');

gulp.task('default', function() {

    nodemon({
        script: 'index.js',
        ext: 'js'
    }).on('restart', function() {

        console.log('The server has been restarted!');
    });
});