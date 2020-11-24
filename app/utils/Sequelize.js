const Config = require('../config/Database');
const Sequelize = require('sequelize');
const dbIndex = 0;

const MySQLSequelize = new Sequelize(
    Config[dbIndex].database,
    Config[dbIndex].username,
    Config[dbIndex].password, {
        host: Config[dbIndex].host,
        port: Config[dbIndex].port,
        dialect: Config[dbIndex].dialect,
        logging: false,
        operatorsAliases: false
    }
);

module.exports = MySQLSequelize;