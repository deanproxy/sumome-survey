'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('SessionQuestionMaps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      QuestionId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      SessionId: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('SessionQuestionMaps');
  }
};
