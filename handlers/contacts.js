'use strict'

module.exports = {

    createContact: function(request, reply) {

        return reply('You are authenticated')
            .header("Authorization", request.headers.authorization)
            .code(201);
    }
};