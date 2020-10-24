'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let lines = []
    let nbLines = 0;
    
    if (process.env.NODE_ENV == 'test') {
        // Add test lines per category
        for (let i = 1; i <= settings.NB_TEST_USERS; ++i) {
            for (let j = 1; j <= settings.NB_TEST_BUDGET_WITH_CHILD_PER_USER; ++j) {
                const budgetId = (i - 1) * settings.NB_TEST_BUDGET_WITH_CHILD_PER_USER + j
                for (let k = 1; k <= settings.NB_TEST_CATEGORY_WITH_CHILD_PER_BUDGET; ++k) {
                    const categoryId = (budgetId - 1) * settings.NB_TEST_CATEGORY_PER_BUDGET + k;
                    for (let l = 1; l <= settings.NB_TEST_LINE_PER_CATEGORY; ++l) {
                        nbLines++;
                        const sign = (l % 2) == 0 ? 1 : -1;
                        lines.push({
                            id: nbLines,
                            name: 'lineTest' + ("0" + k).slice(-2) + ("0" + l).slice(-2),
                            description: 'descTest' + nbLines,
                            categoryId: categoryId,
                            estimate: sign * i * j * k * l
                        });   
                    }
                }
            }
        }
    } else if (process.env.NODE_ENV == 'development') { 
        // Add real lines
        nbLines++;
        lines.push({
            id: nbLines,
            name: 'lineDevTest',
            description: 'descTest',
            categoryId: 1,
            estimate: 10
        });

        // (Budget For User 2)
        for (let i = 3; i < 4; ++i) {
            // Categories (Leave 2 categories empty for testing purposes)
            for (let j = 0; j < 8; ++j) {
                const categoryId = (i - 3) * 10 + j + 2
                for (let k = 0; k < 10; ++k) {
                    nbLines++;
                    lines.push({
                        id: nbLines,
                        name: 'lineDev' + ("00" + nbLines).slice(-3),
                        description: 'lineDesc' + ("00" + nbLines).slice(-3),
                        categoryId: categoryId,
                        estimate: Math.random() * (500 - (-500)) + (-500)
                    });
                }
            }
        }
    }

    if (lines.length > 0) {
        return queryInterface.bulkInsert('Lines', lines, {});
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
