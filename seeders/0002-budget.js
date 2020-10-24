'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let budgets = []
    let nbBudget = 0;

    // Add test budgets per user
    if (process.env.NODE_ENV == 'test') {
        for (let i = 1; i <= settings.NB_TEST_USERS; ++i) {
            for (let j = 1; j <= settings.NB_TEST_BUDGET_PER_USER; ++j) {
                nbBudget++;
                const active = (j == 1);
                budgets.push({
                    id: nbBudget,
                    name: 'budgetTest' + ("00" + i).slice(-3) + ("0" + j).slice(-2),
                    userId: i,
                    startDate: new Date(2020 - j + 1, 0, 1), // Months are indexed at 0, Days are indexed at 1
                    endDate: new Date(2020 - j + 1, 11, 31),
                    isActive: active
                });
            }
        }
    } else if (process.env.NODE_ENV == 'development') {
        // Add real budgets
        budgets.push({
            id: 1,
            name: '2019-2020',
            userId: 1,
            startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
            endDate: new Date(2019, 11, 31),
            isActive: false
        });
        budgets.push({
            id: 2,
            name: '2020-2021',
            userId: 1,
            startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
            endDate: new Date(2020, 11, 31),
            isActive: true
        });

        budgets.push({
            id: 3,
            name: 'LAN 2020',
            userId: 2,
            startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
            endDate: new Date(2020, 11, 31),
            isActive: true
        });

        budgets.push({
            id: 4,
            name: 'LAN 2019',
            userId: 2,
            startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
            endDate: new Date(2019, 11, 31),
            isActive: false
        });

        budgets.push({
            id: 5,
            name: 'LAN 2018',
            userId: 2,
            startDate: new Date(2018, 0, 1), // Months are indexed at 0, Days are indexed at 1
            endDate: new Date(2018, 11, 31),
            isActive: false
        });

        budgets.push({
            id: 6,
            name: 'LAN 2017',
            userId: 2,
            startDate: new Date(2017, 0, 1), // Months are indexed at 0, Days are indexed at 1
            endDate: new Date(2017, 11, 31),
            isActive: false
        });

        budgets.push({
            id: 7,
            name: 'LAN 2016',
            userId: 2,
            startDate: new Date(2016, 0, 1), // Months are indexed at 0, Days are indexed at 1
            endDate: new Date(2016, 11, 31),
            isActive: false
        });
    }

    if (budgets.length > 0) {
        return queryInterface.bulkInsert('Budgets', budgets, {});
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
