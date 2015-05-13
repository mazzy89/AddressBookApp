'use strict';

var AWS = require('aws-sdk');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];

// just for test purpouse
AWS.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.awsRegion
});

var s3Stream = require('s3-upload-stream')(new AWS.S3());
var Firebase = require('firebase');

module.exports = {

    uploadAccountPhoto: function(request, reply) {

        var accountId = request.auth.credentials.id;

        var contactId = request.payload.contactId;
        var file = request.payload.file;

        if(!file.hapi.filename) {
            return reply({
                type: "BadDataError",
                message: "You need to provide a file."
            }).code(422);
        }

        var contactsRef = new Firebase(config.firebaseUrl + '/accounts' + '/' + accountId + '/contacts');

        contactsRef
            .child(contactId)
            .once('value', function(snapshot) {

                // check if the file exist
                if (snapshot.val() !== null) {

                    var bucketName = config.bucketName;
                    var fileKey = accountId + '_' + contactId + '.' + file.hapi.filename.split('.').pop();

                    var upload = s3Stream.upload({
                        "Bucket": bucketName,
                        "Key": fileKey,
                        "ACL": "public-read",
                        "ContentType": file.hapi.headers['content-type']
                    });

                    upload.on('error', function (error) {

                        return reply({
                            type: 'UpdateError',
                            message: "An error occurred during the updating of the file."
                        })
                        .header("Authorization", request.headers.authorization)
                        .code(500);
                    });

                    upload.on('uploaded', function (details) {

                        return reply()
                            .header("Authorization", request.headers.authorization)
                            .code(201);
                    });

                    file.pipe(upload);

                } else {

                    return reply({
                            type: 'ContactNotFound',
                            message: 'The contact doesn\'t exist'
                        })
                        .header("Authorization", request.headers.authorization)
                        .code(404);
                }
        });
    }
};