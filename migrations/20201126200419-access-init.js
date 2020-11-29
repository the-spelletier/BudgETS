'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `Accesses` (`budgetId` CHAR(36) BINARY NOT NULL , `userId` CHAR(36) BINARY NOT NULL , UNIQUE `Accesses_userId_budgetId_unique` (`budgetId`, `userId`), PRIMARY KEY (`budgetId`, `userId`), FOREIGN KEY (`budgetId`) REFERENCES `Budgets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;");
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Accesses')
  }
};
