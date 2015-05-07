'use strict';

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];

var models = require('../models');

exports.register = function(server, options, next) {

    server.register({
        register: require('hapi-auth-jwt2')
    }, function(err) {

        if (err) {
            console.log('An error occured during the registration of hapi-auth-jwt2 plugin');
        }

        server.auth.strategy('jwt', 'jwt', true, {
            key: config.secretKey,
            validateFunc: function(decoded, request, callback) {
                
                models.Account.find({
                    where: {
                        'email': decoded.email
                    }
                }).then(function(account) {

                    // check if the account is valid
                    if (account) {
                        return callback(null, true);
                    } else {
                        return callback(null, false);
                    }
                });
            }
        });
    });

    server.route({
        method: 'GET',
        path: '/access_token',
        config: {
            auth: false,
            handler: function(request, reply) {

                var email = request.query.email;
                var password = request.query.password;

                models.Account.find({
                    where: {
                        'email': email
                    }
                }).then(function(account) {

                    // the user doesn't exist in the db
                    if (account) {

                        bcrypt.compare(password, account.password, function(err, res) {

                            // the user credentials provided are wrong
                            // res return true if the passwords match
                            if (account.email !== email || !res) {

                                return reply({
                                    type: 'InvalidEmailPassword',
                                    message: 'Specified e-mail / password combination is not valid.'
                                }).code(401);

                            } else {

                                var token = jwt.sign(account.get(), config.secretKey, {
                                    expiresInMinutes: '5'
                                });

                                return reply({
                                    access_token: token
                                }).code(200);
                            }
                        });
                    } else {

                        return reply({
                            type: 'UserNotFound',
                            message: 'The user account doesn\'t exist'
                        }).code(404);
                    }
                });
            }
        }
    });

    next();
};

exports.register.attributes = {
    'name': 'auth',
    'version': '1.0.0'
}