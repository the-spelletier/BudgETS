'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `Members` (`id` CHAR(36) BINARY , `name` VARCHAR(255) NOT NULL, `code` VARCHAR(255) NOT NULL UNIQUE, `email` VARCHAR(255) NOT NULL, `userId` CHAR(36) BINARY NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE) ENGINE=InnoDB;");
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Members')
  }
};
