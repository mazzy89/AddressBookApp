'use strict';

module.exports = (sequelize, DataTypes) => {

    const Account = sequelize.define('Account', {
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        indexes: [
            // unique index on email
            {
                unique: true,
                fields: ['email']
            }
        ]
    });

    return Account;
};
