'use strict';

const Hapi = require('hapi');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];

const db = require('./database');

const server = new Hapi.Server();

server.connection({
    port: config.serverPort
});

server.register([{
    register: require('./plugins/auth')
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
}], (err) => {
    if (err) {
        console.error('An error occured during the loading of a plugin');
    }
});

db.sequelize.sync().then(() => {
    server.start(function() {
        console.log(`Server running at ${server.info.uri}`);
    });
});
