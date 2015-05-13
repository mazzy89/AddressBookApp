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
                        code: 400,
                        message: 'Specified e-mail address is already registered.'
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
        validate: {
            headers: Joi
                .object({
                    'authorization': Joi
                        .string()
                        .required()
                        .description('The access token')
                }).unknown(),
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
        description: 'Upload a picture contact',
        notes: 'Upload a picture of a contact on a S3 bucket passing its contact id.',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
                responseMessages: [
                    {
                        code: 404,
                        message: 'The contact doesn\'t exist.'
                    },
                    {
                        code: 422,
                        message: 'You need to provide a file.'
                    },
                    {
                        code: 500,
                        message: 'An error occurred during the updating of the file.'
                    },

                ]
            }
        },
        validate: {
           headers: Joi
                .object({
                    'authorization': Joi
                        .string()
                        .required()
                        .description('The access token')
                }).unknown(),
            payload: {
                contactId: Joi
                    .string()
                    .required()
                    .meta({
                        swaggerType: 'body'
                    })
                    .description('The id of the contact'),
                file: Joi
                    .any()
                    .required()
                    .meta({
                        swaggerType: 'file'
                    })
                    .description('The picture of the contact get by its id')
            }
        }
    }
}];