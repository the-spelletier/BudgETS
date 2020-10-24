'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let entries = []
    let nbEntries = 0;

    if (process.env.NODE_ENV == 'development') {
        // Add real entries
        nbEntries++;
        entries.push({
          id: nbEntries,
          amount: "10.00",
          date: "2021-09-25 00:00:00",
          member: "Bob",
          description: "Description de l'entrée",
          type: "revenue",
          lineId: 1,
          entryStatusId: 1
        });

        // (Budget For User 2)
        for (let i = 3; i < 4; ++i) {
            // Categories (Leave 2 categories empty for testing purposes)
            for (let j = 0; j < 8; ++j) {
                const categoryId = (i - 3) * 10 + j + 2;
                // Lines (Leave 2 lines empty for testing purposes)
                for (let k = 0; k < 8; ++k) {
                    const lineId = ((categoryId - 2) * 10) + k + 2
                    for (let l = 0; l < 20; ++l) {
                        nbEntries++;
                        const year = (i == 3) ? 2020 : 2019;
                        const month = Math.random() * (11 - 0) + 0;
                        const day = Math.random() * (28 - 1) + 1;
                        const type = Math.random() < 0.5 ? 'revenue' : 'expense';
                        entries.push({
                            id: nbEntries,
                            amount: Math.random() * (500 - (-500)) + (-500),
                            date: new Date(year, month, day),
                            member: "LAN",
                            description: 'entryDesc' + ("0000" + nbEntries).slice(-5),
                            type: type,
                            lineId: lineId,
                            entryStatusId: Math.round(Math.random() * (3 - 1) + 1)
                        });
                    }
                }
            }
        }
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
