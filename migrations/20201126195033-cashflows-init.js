'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `Cashflows` (`id` CHAR(36) BINARY , `categoryId` CHAR(36) BINARY NOT NULL, `year` INTEGER(4) NOT NULL, `month` INTEGER(2) NOT NULL, `estimate` DECIMAL(10,2) NOT NULL DEFAULT '0.00', UNIQUE `compositeUnique` (`categoryId`, `year`, `month`), PRIMARY KEY (`id`), FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;");
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Cashflows')
  }
};
