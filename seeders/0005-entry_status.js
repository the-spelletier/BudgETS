'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let entryStatuses = []

    if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'production') {
        // Add real entry statuses
        entryStatuses.push({
            id: 1,
            name: 'Envoyé',
            position: 1,
            budgetId: 8
        });

        entryStatuses.push({
            id: 2,
            name: 'À traiter',
            position: 2,
            budgetId: 8
        });

        entryStatuses.push({
            id: 3,
            name: 'Traité',
            position: 3,
            budgetId: 8
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
