'use strict';

var Lab = require('lab');
// assertion library
var Code = require('code');
var Hapi = require('hapi');
var Joi = require('joi');

var models = require('../models');

// internal object
var internals = {};

// Test shortcuts
var lab = exports.lab = Lab.script();
var experiment = lab.experiment;
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var expect = Code.expect;

describe('Account', function() {

    it("return 400 HTTP error code when no user credentials are provided", function(done) {

        var server = new Hapi.Server();
        server.connection();
        server.route({
            method: 'POST',
            path: '/accounts',
            config: {
                handler: require('../handlers/accounts').createAccount,
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    }
                }
            }
        });

        server.inject({
            method: 'POST',
            url: '/accounts'
        }, function(res) {

            expect(res.statusCode).to.equal(400);
            done();
        });
    });

    before(function(done) {

        models.Account.find({
            where: {
                email: 'samazzarino@gmail.com'
            }
        }).then(function(account) {

            account.destroy()
                .then(function() {
                    done();
                });
        });
    });

    it("return 201 HTTP error code after the creation of a new user account", function(done) {
        
        var server = new Hapi.Server();
        server.connection();
        server.route({
            method: 'POST',
            path: '/accounts',
            handler: require('../handlers/accounts').createAccount
        });

        server.inject({
            method: 'POST',
            url: '/accounts',
            payload: {
                email: 'samazzarino@gmail.com',
                password: 'password'
            }
        }, function(res) {

            expect(res.statusCode).to.equal(201);
            done();
        });
    });

    it("return 400 HTTP error code when the email already exist", function(done) {

        var server = new Hapi.Server();
        server.connection();
        server.route({
            method: 'POST',
            path: '/accounts',
            handler: require('../handlers/accounts').createAccount
        });

        server.inject({
            method: 'POST',
            url: '/accounts',
            payload: {
                email: 'samazzarino@gmail.com',
                password: 'password'
            }
        }, function(res) {

            expect(res.statusCode).to.equal(400);
            done();
        });
    });
});