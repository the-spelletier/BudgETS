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
        else if (process.env.NODE_ENV == 'production') {
            //Only add one admin to start
            users.push({
                id: 1,
                username: 'budgets_admin',
                password: bcrypt.hashSync('admin_2020', config.saltRounds),
                isAdmin: true
            });

            // Users for user tests
            users.push({
                id: 2,
                username: 'user1',
                password: bcrypt.hashSync('user1', config.saltRounds),
                isAdmin: false
            });
            
            users.push({
                id: 3,
                username: 'user2',
                password: bcrypt.hashSync('user2', config.saltRounds),
                isAdmin: false
            });
            
            users.push({
                id: 4,
                username: 'user3',
                password: bcrypt.hashSync('user3', config.saltRounds),
                isAdmin: false
            });
            
            users.push({
                id: 5,
                username: 'user4',
                password: bcrypt.hashSync('user4', config.saltRounds),
                isAdmin: false
            });
            
            users.push({
                id: 6,
                username: 'user5',
                password: bcrypt.hashSync('user5', config.saltRounds),
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
