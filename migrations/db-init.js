'use strict';
const { 
    User,
    Budget,
    Category,
    Line,
    Receipt,
    EntryStatus,
    Entry
} = require('../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await User.sync();
        await Budget.sync();
        await Category.sync();
        await Line.sync();
        await EntryStatus.sync();
        await Receipt.sync();
        await Entry.sync();
    },

    down: async (queryInterface, Sequelize) => {
        await Entry.drop();
        await Receipt.drop();
        await EntryStatus.drop();
        await Line.drop();
        await Category.drop();
        await Budget.drop();
        await User.drop();
    }
};
