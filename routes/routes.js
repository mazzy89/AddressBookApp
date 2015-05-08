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
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().required()
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