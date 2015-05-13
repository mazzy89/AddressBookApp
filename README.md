# AddressBook Application

A RESTful API in Node.js for an AddressBook app. The AddressBook app enables its users to manage a simple contact list by adding new contacts and uploading a profile photos to them. Users of the app are authenticated using their email and password. The Node.js backend app uses three different storage services to maintain the data. User accounts should be stored in any relational database of your choice. Contacts should be stored in Firebase [https://www.firebase.com](https://www.firebase.com) and all the photos associated with contacts should be uploaded to [Microsoft Azure Blob Storage](http://azure.microsoft.com/en-us/documentation/articles/storage-introduction/). 

## Architecture

The application has been developed in [Hapi](http://hapijs.com), a web and services application framework to create simple and robust application in Node.Js. It comes out with built-in support for input validation, caching, authentication, and other essential facilities for building web and services applications in fast and pleasant way. You don't need to reinvent the wheel everytime.

Many startups and well-known companies (Paypal, Disney, etc...) moved to Hapi to empower their backend and create well-tested and maintainable APIs. You can find their stories at [Hapi community](http://www.hapijs.com/community).

### Authentication

The authentication is token based and it's built by recurring to Hapi plugins design pattern in mind. Hapi uses plugins to easily break the application up into isolated pieces of business logic, and reusable utilities. This reason encourages the creation of applications composed by suites of independently deployable services which follow the fresh software design pattern known as Microservices.

In the `middlewares` folder, you can find the plugin which deals with the authentication JWT procedure. The validation of the token during the accessing procedure to a restricted resource is handled by `hapi-auth-jwt2` package. 

In order to access to the resource, you need to supply a valid token to the header:

```
curl -v -H "Authorization: valid_token" http://localhost:3000/contacts
```

### Model layer

The app uses three different layers of persistence. The user accounts are persisted in a MySQL database by using the ORM Sequelize.
The account model is mapped to a table Account with the following schema:

| Id       | Email            | Password         | createdAt      | updatedAt    |
|---------:|-----------------:|-----------------:|---------------:|-------------:|
| 1        | name@email.com   | crypted password | date           | date         |

The contacts data are saved in Firebase with the following structure:

```javascript
accounts: {
    accountId: {
        contacts: {
            contactId: {
                firstName: ...,
                lastName: ...,
                phone: ...
            },
            ...
        } 
    }
}
```

Despite what you have read here above, the photos associated with contacts are saved to an Amazon S3 bucket. In order to open a Microsoft Azure Trial, you need to provide a credit card (Microsoft doesn't accept pre-paid cards).

## Configuration

Before running the application, you have to place a file called `config.json` into the folder `config`. It needs to set the following parameters for the different environements:

- `serverPort`: the connection port of the server
- `username`: the username to grant access to the database
- `password`: the password to grant access to the database
- `database`: the name of the database
- `host`: IP address or hostname of the server where MySQL runs
- `dialect`: define which driver use. Please refer to Sequelize doc
- `secretKey`: the secret key used to create the JWT token
- `firebaseUrl`: Firebase url
- `accessKeyId`: Amazon AWS Access Key Id
- `secretAccessKey`: Amazon AWS Secret Access Key
- `awsRegion`: Amazon AWS where S3 bucket resides
- `bucketName`: Amazon AWS S3 bucket name

Here below the suggested structure used:

```javascript
{
  "development": {
    "serverPort": ...
    "username": ...,
    "password": ...,
    "database": ...,
    "host": ...,
    "dialect": ...,
    "secretKey": ...,
    "firebaseUrl": ...,
    "accessKeyId": ...,
    "secretAccessKey": ...,
    "awsRegion": ...,
    "bucketName": ...
  }, 
  "test": {
     ...
  }
}

```

## Run

Install the required dependecies:

```
npm install
```

Install locally `gulp`

```
npm install -g gulp
```

Run the application: 

```
gulp
```

NOTE: In order to upload photos on an Amazon S3 bucket you need to have an Amazon AWS account. Create an IAM user and use the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` provided by AWS.

## Test

Tested API endpoints with [Postman](https://www.getpostman.com/).

## Documentation

The project makes use of a hapi.js plugin `hapi-swagger` which self documents the API using the Swagger UI interface. It provides simple forms which developers can use to quickly interact with your API and learn how it works. The forms and documentation are built from the standard hapi.js routes object.

To explore the documention, go to `/documentation`.


