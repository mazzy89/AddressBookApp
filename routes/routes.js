'use strict';

var Handlers = require('../handlers/handlers');

module.exports = [{
    method: 'POST',
    path: '/accounts',
    config: {
        auth: false,
        handler: Handlers.createAccount
	}
}];