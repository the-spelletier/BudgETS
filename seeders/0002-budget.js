'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Budgets', [{
      id: 1,
      name: '2020-2021',
      userId: 1,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    }], {});
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
