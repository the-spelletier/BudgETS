'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let entryStatuses = []

    if (process.env.NODE_ENV == 'development') {
        // Add real entry statuses
        entryStatuses.push({
            id: 1,
            name: 'Envoyé',
            position: 1
        });
    }

    if (entryStatuses.length > 0) {
        return queryInterface.bulkInsert('EntryStatuses', entryStatuses, {});
    }

    return;
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
