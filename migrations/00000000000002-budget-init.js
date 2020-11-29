'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `Budgets` (`id` CHAR(36) BINARY , `name` VARCHAR(255) NOT NULL, `userId` CHAR(36) BINARY NOT NULL, `startDate` DATETIME NOT NULL, `endDate` DATETIME NOT NULL, `isActive` TINYINT(1) DEFAULT false, UNIQUE `compositeUnique` (`name`, `userId`), PRIMARY KEY (`id`), FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE) ENGINE=InnoDB;");
  },
  
  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Budgets')
  }
};
