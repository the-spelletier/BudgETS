const Sequelize = require('sequelize');

// Informations de connexions à la base de données

const sequelize = new Sequelize(
    'BudgETS',
    'root',
    'mysql',
    {
        host: 'localhost',
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

module.exports = sequelize;
