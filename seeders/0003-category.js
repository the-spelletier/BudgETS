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
    } else if (process.env.NODE_ENV == 'development') {
        // Add real categories
        nbCategories++;
        categories.push({
            id: nbCategories,
            name: 'categoryDevTest',
            budgetId: 1,
            type: 'revenue'
        });

        // Budget 03 (User 2)
        for (let i = 0; i < 10; ++i) {
            nbCategories++;
            categories.push({
                id: nbCategories,
                name: 'categoryDev03' + ("0" + i).slice(-2),
                budgetId: 3,
                type: 'revenue'
            });
            nbCategories++;
            categories.push({
                id: nbCategories,
                name: 'categoryDev03' + (i + 10),
                budgetId: 3,
                type: 'expense'
            });
        }

        // Budget 04 (User 2)
        for (let i = 0; i < 10; ++i) {
            nbCategories++;
            categories.push({
                id: nbCategories,
                name: 'categoryDev04' + ("0" + i).slice(-2),
                budgetId: 4,
                type: 'revenue'
            });
            nbCategories++;
            categories.push({
                id: nbCategories,
                name: 'categoryDev04' + ("0" + (i + 10)).slice(-2),
                budgetId: 4,
                type: 'expense'
            });
        }

        // Budget 05 (User 2)
        for (let i = 0; i < 10; ++i) {
            nbCategories++;
            categories.push({
                id: nbCategories,
                name: 'categoryDev05' + ("0" + i).slice(-2),
                budgetId: 5,
                type: 'revenue'
            });
            nbCategories++;
            categories.push({
                id: nbCategories,
                name: 'categoryDev05' + ("0" + (i + 10)).slice(-2),
                budgetId: 5,
                type: 'expense'
            });
        }

        // Budget 06 (User 2)
        for (let i = 0; i < 10; ++i) {
            nbCategories++;
            categories.push({
                id: nbCategories,
                name: 'categoryDev06' + ("0" + i).slice(-2),
                budgetId: 6,
                type: 'revenue'
            });
            nbCategories++;
            categories.push({
                id: nbCategories,
                name: 'categoryDev06' + ("0" + (i + 10)).slice(-2),
                budgetId: 6,
                type: 'expense'
            });
        }
    }

    if (categories.length > 0) {
        return queryInterface.bulkInsert('Categories', categories, {});
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
