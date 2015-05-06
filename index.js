'use strict';

var Hapi = require('hapi');

var dotenv = require('dotenv');

// load the env variables
// stored into .env file
dotenv.load();

var server = new Hapi.Server();

server.connection({

    port: process.env.PORT
});

server.register([{

    register: require('hapi-router'),
    options: {
        routes: 'routes/**/*.js'
    }
}], function(err) {

    if (err) {
        console.log('An error occured during the loading of a plugin');
    }

    server.start(function() {

        console.log('Server running at', server.info.uri);
    });
});

