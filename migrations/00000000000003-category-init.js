'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `Categories` (`id` CHAR(36) BINARY , `name` VARCHAR(255) NOT NULL, `orderNumber` INTEGER NOT NULL DEFAULT '99', `budgetId` CHAR(36) BINARY NOT NULL, `type` ENUM('revenue', 'expense') NOT NULL, UNIQUE `compositeUnique` (`name`, `budgetId`, `type`), PRIMARY KEY (`id`), FOREIGN KEY (`budgetId`) REFERENCES `Budgets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE) ENGINE=InnoDB;");
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Categories')
  }
};
