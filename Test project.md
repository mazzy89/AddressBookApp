General requirements
====================

* The application should be written in Node.js using either Express.js or Restify.js as the main framework.

* You can assume that the client app reads data directly from Firebase so no API endpoints for reading data (listing contacts etc.) are required.

* Create a free Firebase hacker plan (https://www.firebase.com). Please provide us with credentials to the Firebase (you can send an invite to the Firebase to martin@strv.com).

* Create a free trial account on Windows Azure (http://windowsazure.com). Please provide us with credentials to the storage account (account name, key).

* If you decide to implement anything in a different (better) way than suggested in this documentation please explain that in e-mail.


Create user account
===================

* Store user accounts in any relational database of your choice.

### Request

~~~HTTP
POST: /accounts HTTP/1.1
Content-type: application/json
~~~

~~~JSON
{
  "email": "USER_EMAIL",
  "password": "USER_PASSWORD"
}
~~~

### Response

~~~HTTP
HTTP/1.1 201 Created
~~~

### Errors

Type        | Description
----------- | -----------
EmailExists | Specified e-mail address is already registered.


Authenticate user
=================

* Validate the e-mail and password combination and based on that return an access token for the user.

* You can use node-jwt-simple package to generate the token (https://github.com/hokaccha/node-jwt-simple).

### Request

~~~HTTP
GET: /access_token HTTP/1.1
~~~

Parameter | Description
--------- | -----------
email     | The user's e-mail address
password  | The user's password

### Response

~~~HTTP
HTTP/1.1 200 OK
~~~

~~~JSON
{
  "access_token": "ACCESS_TOKEN"
}
~~~

### Errors

Type                | Description
------------------- | -----------
InvlidEmailPassword | Specified e-mail / password combination is not valid.


Create a contact
================

* Store all contacts in Firebase (http://firebase.com).

* You can either use the RESTful API (https://www.firebase.com/docs/rest/) or the official JavaScript SDK (https://www.firebase.com/docs/web/) to write to Firebase.

* Use passport package (http://passportjs.org) with the Bearer strategy (https://github.com/jaredhanson/passport-http-bearer) to validate the access token when accessing the resource.

### Request

~~~HTTP
POST: /contacts?access_token=... HTTP/1.1
~~~

Parameter | Description
--------- | -----------
access_token     | The access token obtained based on successful authentication

~~~JSON
{
  "firstName": "FIRST_NAME",
  "lastName": "LAST_NAME",
  "phone": "PHONE_NUMBER"
}
~~~

### Response

~~~HTTP
HTTP/1.1 201 Created
~~~


Upload a photo
==============

* Store all the photos in Micrsoft Azure Blob Storage (http://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-blob-storage/) using the official Node.js SDK (http://azure.microsoft.com/en-us/develop/nodejs/).

* Use passport package (http://passportjs.org) with the Bearer strategy (https://github.com/jaredhanson/passport-http-bearer) to validate the access token when accessing the resource.

### Request

~~~HTTP
POST: /photos?access_token=...&contactId=CONTACT_ID HTTP/1.1
Content-Type: multipart/form-data
~~~

Parameter | Description
--------- | -----------
access_token     | The access token obtained based on successful authentication

### Response

~~~HTTP
HTTP/1.1 201 Created
~~~


Error format
============

* Any errors should be returned in the format specified below using 4xx HTTP status code.

~~~HTTP
HTTP/1.1 4xx ...
~~~

~~~JSON
{
  "type": "ERROR_TYPE",
  "message": "DEBUG_MESSAGE"
}
~~~
