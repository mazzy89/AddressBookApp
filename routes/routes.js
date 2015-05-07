'use strict';

var accounts = require('../handlers/accounts');
var contacts = require('../handlers/contacts');
var photos = require('../handlers/photos');

module.exports = [{
    method: 'POST',
    path: '/accounts',
    config: {
        auth: false,
        handler: accounts.createAccount
    }
}, {
    method: 'POST',
    path: '/contacts',
    config: {
        auth: 'jwt',
        handler: contacts.createContact
    }
}, {
    method: 'POST',
    path: '/photos',
    config: {
        auth: false,
        handler: photos.uploadAccountPhoto
    }
}];