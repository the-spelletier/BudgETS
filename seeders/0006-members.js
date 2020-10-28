'use strict';
const settings = require('../config/testsConfig');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let members = [];
        let nbMembers = 0;

        if (process.env.NODE_ENV == 'test') {

            for (let i = 1; i <= settings.NB_TEST_USERS; ++i) {
                nbMembers++;
                members.push({
                    id: nbMembers,
                    name: 'member_test' + ('00' + i),
                    code: '987654321' + nbMembers,
                    email: i + 'member@test.com',
                    userId: nbMembers
                });
            }

        } else if (process.env.NODE_ENV == 'development') {

            members.push({
                id: 1,
                name: 'Charles Machinchose',
                code: '12345',
                email: 'charles@machinchose.com',
                userId: 1,
            });

            members.push({
                id: 2,
                name: 'Charlotte Machinchose',
                code: '23456',
                email: 'charlotte@machinchose.com',
                userId: 1
            });

        }
        
        if (members.length > 0) {
            return queryInterface.bulkInsert('Members', members, {});
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
