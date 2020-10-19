'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let entries = []

    if (process.env.NODE_ENV == 'development') {
        // Add real entries
        entries.push({
          id: 1,
          amount: "10.00",
          date: "2021-09-25 00:00:00",
          member: "Bob",
          description: "Description de l'entrée",
          type: "revenue",
          lineId: 1,
          entryStatusId: 1
        });
    }

    if (entries.length > 0) {
        return queryInterface.bulkInsert('Entries', entries, {});
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
