'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let entries = []

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


    return queryInterface.bulkInsert('Entries', entries, {});
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
