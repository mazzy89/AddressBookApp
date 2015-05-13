'use strict';

var Hapi = require('hapi');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/config.json')[env];

var models = require('./models');

var server = new Hapi.Server();

server.connection({

    port: config.serverPort
});

server.register([{
    register: require('./middlewares/auth')
},{

    register: require('hapi-router'),
    options: {
        routes: 'routes/*.js'
    }
},{
    register: require('hapi-swagger'),
    options: {
        apiVersion: require('./package').version
    }
}], function(err) {

    if (err) {
        console.log('An error occured during the loading of a plugin');
    }
});

models.sequelize.sync().then(function() {
    
    server.start(function() {
        console.log('Server running at', server.info.uri);
    }); 
});

