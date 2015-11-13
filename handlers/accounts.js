'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');

const db = require('../database');

module.exports.createAccount = (request, reply) => {
    const response = {};
    
    const email = request.payload.email;
    const password = request.payload.password;

    // TODO: use findOrCreate
    db.Account.find({
        where: {
            'email': email
        }
    }).then((account) => {
        // the user already exist in the database
        if (account) {
            response.type = 'EmailExists';
            response.message = 'Specified e-mail address is already registered.';
            return reply(response).code(400);
        } else {
            // create a new user
            // TODO: hash the password in the hook...
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    models.Account.create({
                        email: email,
                        password: hash
                    }).then((newAccount) => {
                        // here return http 201 new account created
                        return reply().code(201);
                    }).catch((error) => {
                        console.error(error);
                        return reply(Boom.badImplementation('An internal server error occured.'));
                    });
                });
            });
        }
    });
};
