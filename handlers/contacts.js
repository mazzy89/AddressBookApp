'use strict'

var Firebase = require('firebase');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];

module.exports = {

    createContact: function(request, reply) {

        var accountId = request.auth.credentials.id;

        // get data from the payload
        var firstName = request.payload.firstName;
        var lastName = request.payload.lastName;
        var phone = request.payload.phone;

        //here save the data with firebase
        var accountRef = new Firebase(config.firebaseUrl + '/accounts' + '/' + accountId);
        
        accountRef
            .child("contacts")
            .push({
                firstName: firstName,
                lastName: lastName,
                phone: phone
            });
        
        return reply()
            .header("Authorization", request.headers.authorization)
            .code(201);
    }
};