'use strict';

var bcrypt = require('bcrypt');
var Boom = require('boom');

var models = require('../models');

module.exports = {

    createAccount: function(request, reply) {

        var email = request.payload.email;
        var password = request.payload.password;

        models.Account.find({
            where: {
                'email': email
            }
        }).then(function(account) {

            // the user already exist in the database
            if (account) {

                return reply({
                    type: 'EmailExists',
                    message: 'Specified e-mail address is already registered.'
                }).code(400);

            } else {
                // create a new user
                bcrypt.genSalt(10, function(err, salt) {

                    bcrypt.hash(password, salt, function(err, hash) {
                        
                        models.Account.create({
                            email: email,
                            password: hash
                        }).then(function(newAccount) {
                            
                            // here return http 201 new account created
                            return reply()
                                .code(201);

                        }).catch(function(error) {

                            console.log(error);

                            return reply(Boom.badImplementation('An internal server error occured.'));
                        });
                    });
                });
            }
        });
    }
};
