'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('Users', {
            id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,  
            type: Sequelize.INTEGER
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            attemptFailed : {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            isBlocked : {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            isAdmin : {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        });
        await queryInterface.createTable('Budgets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId',
                }
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            isActive : {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        });
        await queryInterface.createTable('Categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: 'compositeUnique'
            },
            budgetId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Budgets',
                    key: 'id',
                    as: 'budgetId',
                }
            },
            type: {
                type: Sequelize.ENUM('revenue', 'expense'),
                allowNull: false,
                unique: 'compositeUnique',
                validate: {
                    isIn: [['revenue', 'expense']]
                }
            }
        });
        await queryInterface.createTable('Lines', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Categories',
                    key: 'id',
                    as: 'categoryId',
                }
            },
            expenseEstimate: {
                type: Sequelize.DECIMAL(10,2),
                allowNull: false,
                defaultValue: '0.00',
            }
        });
        await queryInterface.createTable('EntryStatus', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            position: {
                type: Sequelize.INTEGER
            }
        });
        await queryInterface.createTable('Entries', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            lineId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Lines',
                    key: 'id',
                    as: 'lineId',
                }
            },
            entryStatusId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'EntryStatus',
                    key: 'id',
                    as: 'entryStatusId',
                }
            },
            amount: {
                type: Sequelize.DECIMAL(10,2),
                allowNull: false,
                defaultValue: '0.00',
            },
            date: {
                type: Sequelize.DATE,
            },
            member: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.ENUM('revenue', 'expense'),
                allowNull: false,
                validate: {
                    isIn: [['revenue', 'expense']]
                }
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Entries');
        await queryInterface.dropTable('EntryStatus');
        await queryInterface.dropTable('Lines');
        await queryInterface.dropTable('Categories');
        await queryInterface.dropTable('Budgets');
        await queryInterface.dropTable('Users');
    }
};
