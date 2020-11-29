'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `Entries` (`id` CHAR(36) BINARY , `lineId` CHAR(36) BINARY NOT NULL, `entryStatusId` CHAR(36) BINARY, `memberId` CHAR(36) BINARY, `amount` DECIMAL(10,2) NOT NULL DEFAULT '0.00', `date` DATETIME, `description` VARCHAR(255), `receiptCode` VARCHAR(255), PRIMARY KEY (`id`), FOREIGN KEY (`lineId`) REFERENCES `Lines` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE, FOREIGN KEY (`entryStatusId`) REFERENCES `EntryStatuses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE, FOREIGN KEY (`memberId`) REFERENCES `Members` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE) ENGINE=InnoDB;");
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Entries')
  }
};
