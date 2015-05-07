'use strict';

module.exports = function(sequelize, DataTypes) {

  var Account = sequelize.define('Account', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  
  return Account;
};