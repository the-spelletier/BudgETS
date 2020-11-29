'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("CREATE TABLE IF NOT EXISTS `EntryStatuses` (`id` CHAR(36) BINARY , `name` VARCHAR(255), `position` INTEGER, PRIMARY KEY (`id`)) ENGINE=InnoDB;");
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('EntryStatuses')
  }
};
