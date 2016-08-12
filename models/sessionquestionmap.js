'use strict';
module.exports = function(sequelize, DataTypes) {
  var SessionQuestionMap = sequelize.define('SessionQuestionMap', {
    questionId: DataTypes.INTEGER,
    sessionId: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        SessionQuestionMap.belongsTo(models.Question);
      }
    }, 
    timestamps: false
  });
  return SessionQuestionMap;
};
