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
      name: 'budgetTest0101',
      userId: 1,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 2,
      name: 'budgetTest0102',
      userId: 1,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 3,
      name: 'budgetTest0201',
      userId: 2,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 4,
      name: 'budgetTest0202',
      userId: 2,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 5,
      name: 'budgetTest0301',
      userId: 3,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 6,
      name: 'budgetTest0302',
      userId: 3,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 7,
      name: 'budgetTest0401',
      userId: 4,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 8,
      name: 'budgetTest0402',
      userId: 4,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 9,
      name: 'budgetTest0501',
      userId: 5,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 10,
      name: 'budgetTest0502',
      userId: 5,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 11,
      name: 'budgetTest0601',
      userId: 6,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 12,
      name: 'budgetTest0602',
      userId: 6,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 13,
      name: 'budgetTest0701',
      userId: 7,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 14,
      name: 'budgetTest0702',
      userId: 7,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 15,
      name: 'budgetTest0801',
      userId: 8,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 16,
      name: 'budgetTest0802',
      userId: 8,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 17,
      name: 'budgetTest0901',
      userId: 9,
      startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2020, 11, 31),
      isActive: true
    },{
      id: 18,
      name: 'budgetTest0902',
      userId: 9,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 19,
      name: '2019-2020',
      userId: 10,
      startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
      endDate: new Date(2019, 11, 31),
      isActive: false
    },{
      id: 20,
      name: '2020-2021',
      userId: 10,
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
