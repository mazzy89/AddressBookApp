'use strict';

var AWS = require('aws-sdk');
var s3Stream = require('s3-upload-stream')(new AWS.S3());
var Firebase = require('firebase');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];

// Ireland region
AWS.config.region = config.awsRegion;

module.exports = {

    uploadAccountPhoto: function(request, reply) {

        var accountId = request.auth.credentials.id;

        var contactId = request.payload.contactId;
        var file = request.payload.file;

        var accountRef = new Firebase(config.firebaseUrl + '/accounts' + '/' + accountId + '/contacts');

        accountRef
            .child(contactId)
            .once('value', function(snapshot) {

                // check if the file exist
                if (snapshot.val() !== null) {

                    var bucketName = config.bucketName;
                    var fileKey = accountId + '_' + contactId + '.' + file.hapi.filename.split('.').pop();

                    var upload = s3Stream.upload({
                        "Bucket": bucketName,
                        "Key": fileKey,
                        "ContentType": file.hapi.headers['content-type']
                    });

                    upload.on('error', function (error) {

                        return reply({
                            type: 'UpdateError',
                            message: "An error occurred during the updating of the file"
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