'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');
const settings = require('../config/testsConfig');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let users = [];
        let nbUsers = 0;

        // Add test users
        if (process.env.NODE_ENV == 'test') {
            for (let i = 1; i <= settings.NB_TEST_USERS; ++i) {
                nbUsers++;
                users.push({
                    id: nbUsers,
                    username: 'budgets_test' + ('00' + nbUsers).slice(-3),
                    password: bcrypt.hashSync('test123', config.saltRounds),
                    isAdmin: (i == 1),
                    activeBudgetId: i == 2 ? '5' : null
                });
            }

            // Add dummy users with no budget owner (Used for access tests and so on)
            for (let i = 1; i <= settings.NB_TEST_DUMMY_USERS; ++i) {
                nbUsers++;
                users.push({
                    id: nbUsers,
                    username: 'budgets_test' + ('00' + nbUsers).slice(-3),
                    password: bcrypt.hashSync('test123', config.saltRounds),
                    isAdmin: false,
                    activeBudgetId: null
                });
            }
        } else if (process.env.NODE_ENV == 'development') {
            // Add real users
            users.push({
                id: 1,
                username: 'budgets_admin',
                password: bcrypt.hashSync('admin_2020', config.saltRounds),
                isAdmin: true
            });

            users.push({
                id: 2,
                username: 'budgets_user',
                password: bcrypt.hashSync('dev123', config.saltRounds),
                isAdmin: false
            });

            users.push({
                id: 3,
                username: 'budgets_user2',
                password: bcrypt.hashSync('dev123', config.saltRounds),
                isAdmin: false
            });

            users.push({
                id: 4,
                username: 'simon_demo',
                password: bcrypt.hashSync('demo_2020', config.saltRounds),
                isAdmin: false
            });
        }

        if (users.length > 0) {
            return queryInterface.bulkInsert('Users', users, {});
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
