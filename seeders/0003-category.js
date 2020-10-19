'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let categories = []
    let nbCategories = 0;
    
    if (process.env.NODE_ENV == 'test') {
        // Add test categories per budget
        for (let i = 1; i <= settings.NB_TEST_USERS; ++i) {
            for (let j = 1; j <= settings.NB_TEST_BUDGET_WITH_CHILD_PER_USER; ++j) {
                const budgetId = (i - 1) * settings.NB_TEST_BUDGET_PER_USER + j;
                for (let k = 1; k <= settings.NB_TEST_CATEGORY_PER_BUDGET; ++k) {
                    nbCategories++;
                    const typeStr = (k % 2) == 0 ? 'revenue' : 'expense';
                    categories.push({
                        id: nbCategories,
                        name: 'categoryTest' + ("0" + j).slice(-2) + ("0" + k).slice(-2),
                        budgetId: budgetId,
                        type: typeStr
                    });

                }
            }
        }
    }

    // Add real categories
    //...


    return queryInterface.bulkInsert('Categories', categories, {});
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
