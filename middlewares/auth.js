'use strict';

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var Joi = require('joi');

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

                    // check if the account exists
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

                    if (account) {

                        bcrypt.compare(password, account.password, function(err, res) {

                            // password is wrong
                            // res return true if the passwords match
                            if (!res) {

                                return reply({
                                    type: 'InvalidEmailPassword',
                                    message: 'Specified e-mail / password combination is not valid.'
                                }).code(401);

                            } else {

                                var token = jwt.sign(account.get(), config.secretKey, {
                                    expiresInMinutes: '10'
                                });

                                return reply({
                                    access_token: token
                                }).code(200);
                            }
                        });
                    } else {

                        // the user doesn't exist in the db
                        // return reply({
                        //     type: 'UserNotFound',
                        //     message: 'The user account doesn\'t exist'
                        //}).code(404);
                        
                        return reply({
                            type: 'InvalidEmailPassword',
                            message: 'Specified e-mail / password combination is not valid.'
                        }).code(401);
                    }
                });
            },
            validate: {
                query: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            }
        }
    });

    // pass the request to the flow
    next();
};

exports.register.attributes = {
    'name': 'auth',
    'version': '1.0.0'
}