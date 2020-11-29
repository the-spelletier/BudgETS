'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `Lines` (`id` CHAR(36) BINARY , `name` VARCHAR(255), `description` VARCHAR(255), `orderNumber` INTEGER NOT NULL DEFAULT '99', `categoryId` CHAR(36) BINARY NOT NULL, `estimate` DECIMAL(10,2) NOT NULL DEFAULT '0.00', UNIQUE `compositeUnique` (`name`, `categoryId`), PRIMARY KEY (`id`), FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE) ENGINE=InnoDB;");
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Lines')
  }
};
