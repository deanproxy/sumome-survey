'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('sessions', {
      session_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255)
      },
      expires: {
        type: Sequelize.DATE
      },
      data: {
        type: Sequelize.BLOB
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('sessions');
  }
};
