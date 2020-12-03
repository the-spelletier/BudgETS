'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let entryStatuses = []
    let nbItems = 0;

    if (process.env.NODE_ENV == 'test') {
        // Budget 1 (User 001)
        // 14.1 tests
        entryStatuses.push({
            id: 1,
            name: 'Envoyé',
            position: 1,
            budgetId: 1
        });
        entryStatuses.push({
            id: 2,
            name: 'À traiter',
            position: 2,
            budgetId: 1
        });
        entryStatuses.push({
            id: 3,
            name: 'Traité',
            position: 3,
            budgetId: 1
        });

        // Budget 9 (User 003)
        // 14.3 tests
        for (let i = 1; i <= 10; ++i) {
            entryStatuses.push({
                id: 300+i,
                name: 'Test' + 300+i,
                position: i,
                budgetId: 9
            });
        }

        // Budget 13 (User 004)
        // 14.4 tests
        for (let i = 1; i <= 10; ++i) {
            entryStatuses.push({
                id: 400+i,
                name: 'Test' + 400+i,
                position: i,
                budgetId: 13
            });
        }

    } else if (process.env.NODE_ENV == 'development') {
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
