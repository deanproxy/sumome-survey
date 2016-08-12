'use strict';
module.exports = function(sequelize, DataTypes) {
  var session = sequelize.define('session', {
    session_id: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.BLOB
  }, {
    id: false,
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return session;
};
