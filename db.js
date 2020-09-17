const Sequelize = require('sequelize');

// Informations de connexions à la base de données

const sequelize = new Sequelize(
    'database',
    'username',
    'password',
    {
        host: 'where',
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
