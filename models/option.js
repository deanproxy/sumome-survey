'use strict';
module.exports = function(sequelize, DataTypes) {
  var Option = sequelize.define('Option', {
    title: DataTypes.STRING,
    selected: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Option.belongsTo(models.Question);
      }
    }
  });
  return Option;
};
