'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = require('../database');

const internals = {};

internals.validateFunc = (decoded, request, callback) => {
    db.Account.find({
        where: {
            'email': decoded.email
        }
    }).then((account) => {
        // check if the account exists
        if (account) {
            return callback(null, true);
        } else {
            return callback(null, false);
        }
    });
}

exports.register = (plugin, options, next) {

    plugin.register({
        register: require('hapi-auth-jwt2')
    }, (err) => {

        if (err) {
            console.error('An error occured during the registration of hapi-auth-jwt2 plugin');
        }

        plugin.auth.strategy('jwt', 'jwt', true, {
            key: config.secretKey,
            validateFunc: internals.validateFunc
        });
    });

    plugin.route({
        method: 'GET',
        path: '/access_token',
        config: {
            auth: false,
            handler: (request, reply) => {

                const response = {};

                const email = request.query.email;
                const password = request.query.password;

                db.Account.find({
                    where: {
                        'email': email
                    }
                }).then((account) => {

                    if (account) {
                        bcrypt.compare(password, account.password, (err, res) => {
                            // password is wrong
                            // res return true if the passwords match
                            if (!res) {
                                response.type = 'InvalidEmailPassword';
                                response.message = 'SSpecified e-mail/password combination is not valid.'
                                return reply(response).code(401);
                            } else {

                                const token = jwt.sign(account.get(), config.secretKey, {
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
            description: 'Get a new access token',
            notes: 'Get a new access token passing the user credentials',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'The specified e-mail and / or password combination is not valid.'
                        }
                    ]
                }
            },
            validate: {
                query: {
                    email: Joi
                        .string()
                        .email()
                        .required()
                        .description('The e-mail of the user account'),
                    password: Joi
                        .string()
                        .required()
                        .description('The password of the user account')
                }
            }
        }
    });

    // pass the request to the flow
    next();
};

exports.register.attributes = {
    'name': 'auth',
    'version': require('../package.json').version
}
