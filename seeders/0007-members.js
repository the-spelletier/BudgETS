'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let members = [];

        // Add test users
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
