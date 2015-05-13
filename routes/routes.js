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
        description: 'Create a new contact',
        notes: 'Create a new address book contact associated to the authenticated user.',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                responseMessages: [
                    {
                        code: 201,
                        message: 'The contact has been created'
                    }
                ]
            }
        },
        validate: {
            headers: {
                Authorization: Joi
                    .string()
                    .required()
                    .description('The access token')
            },
            payload: {
                firstName: Joi
                    .string()
                    .required()
                    .description('The first name of the contact'),
                lastName: Joi
                    .string()
                    .required()
                    .description('The last name of the contact'),
                phone: Joi
                    .string()
                    .required()
                    .description('The phone number of the contact')
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