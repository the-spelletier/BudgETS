'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let entryStatuses = []
    let nbEntryStatus = 0;

    // Add real entry statuses
    entryStatuses.push({
        id: 1,
        name: 'Envoyé',
        position: 1
    });

    return queryInterface.bulkInsert('EntryStatuses', entryStatuses, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
