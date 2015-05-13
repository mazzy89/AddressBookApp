'use strict';

var Joi = require('joi');

var accounts = require('../handlers/accounts');
var contacts = require('../handlers/contacts');
var photos = require('../handlers/photos');

module.exports = [{
    method: 'POST',
    path: '/accounts',
    config: {
        auth: false,
        handler: accounts.createAccount,
        description: 'Create a new user account',
        notes: 'Create a new user account passing the email and the password.',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                responseMessages: [
                    {
                        code: 201,
                        message: 'The user account has been created'
                    },
                    {
                        code: 400,
                        message: 'The user account already exist'
                    }
                ]
            }
        },
        validate: {
            payload: {
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
}, {
    method: 'POST',
    path: '/contacts',
    config: {
        auth: 'jwt',
        handler: contacts.createContact,
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                phone: Joi.string().required()
            }
        }
    }
}, {
    method: 'POST',
    path: '/photos',
    config: {
        auth: 'jwt',
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },
        handler: photos.uploadAccountPhoto,
        validate: {
            payload: {
                contactId: Joi.string().required(),
                file: Joi.any().required()
            }
        }
    }
}];