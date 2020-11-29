'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `Users` (`id` CHAR(36) BINARY , `username` VARCHAR(255) NOT NULL UNIQUE, `password` VARCHAR(255) NOT NULL, `attemptFailed` INTEGER DEFAULT 0, `isBlocked` TINYINT(1) DEFAULT false, `isAdmin` TINYINT(1) DEFAULT false, `activeBudgetId` CHAR(36) BINARY, PRIMARY KEY (`id`)) ENGINE=InnoDB;")
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Users')
  }
};
