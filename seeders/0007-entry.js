'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let entries = []
    let nbEntries = 0;

    if (process.env.NODE_ENV == 'test') {
        // Add test entries per line
        for (let i = 1; i <= settings.NB_TEST_USERS; ++i) {
            for (let j = 1; j <= settings.NB_TEST_BUDGET_WITH_CHILD_PER_USER; ++j) {
                const budgetId = (i - 1) * settings.NB_TEST_BUDGET_PER_USER + j
                for (let k = 1; k <= settings.NB_TEST_CATEGORY_WITH_CHILD_PER_BUDGET; ++k) {
                    const categoryId = (budgetId + j - 2) * settings.NB_TEST_CATEGORY_WITH_CHILD_PER_BUDGET + k;
                    for (let l = 1; l <= settings.NB_TEST_LINE_WITH_CHILD_PER_CATEGORY; ++l) {
                        const lineId = (categoryId + k - 2) * settings.NB_TEST_LINE_WITH_CHILD_PER_CATEGORY + l;
                        for (let m = 1; m <= settings.NB_TEST_ENTRY_PER_LINE; ++m) {
                            nbEntries++;
                            const sign = (m % 2) == 0 ? 1 : -1;
                            entries.push({
                                id: nbEntries,
                                amount: sign * ((nbEntries * 10) % 1000),
                                date: new Date(2020, 9, 31), // Month indexed at 0 (2020-10-31)
                                memberId: 1,
                                description: 'entryDesc' + ("0000" + nbEntries).slice(-5),
                                lineId: lineId,
                                entryStatusId: ((nbEntries % 3) + 1)
                            });
                        }
                    }
                }
            }
        }
    } else if (process.env.NODE_ENV == 'development') {
        // Add real entries
        nbEntries++;
        entries.push({
          id: nbEntries,
          amount: "10.00",
          date: "2021-09-25 00:00:00",
          description: "Description de l'entrée",
          lineId: 1,
          memberId: 1,
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
