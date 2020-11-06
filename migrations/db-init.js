'use strict';
const { 
    User,
    Budget,
    Category,
    Line,
    EntryStatus,
    Entry,
    Member,
    Access
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
        await Member.sync();
        await Entry.sync();
        await Access.sync();
    },

    down: async (queryInterface, Sequelize) => {
        await Access.drop();
        await Entry.drop();
        await Member.drop();
        await EntryStatus.drop();
        await Line.drop();
        await Category.drop();
        await Budget.drop();
        await User.drop();
    }
};
