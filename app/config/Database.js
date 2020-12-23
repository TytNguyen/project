require("dotenv").config()

let DBConnectorSetting = [
    // {
    //     host: 'db4free.net',
    //     port: '3306',
    //     username: 'tytnguyen',
    //     password: `${process.env.DB_PASSWORD}`,
    //     database: 'exchange_website',
    //     dialect: 'mysql',
    //     charset: 'utf8mb4',
    //     collation: 'utf8mb4_unicode_ci',
    //     prefix: '',
    //     strict: false,
    //     engine: null
    // },
    {
        host: '127.0.0.1',
        port: '3306',
        username: 'admin',
        password: '@12345admin',
        database: 'database',
        dialect: 'mysql'
    },
    {
        host: '127.0.0.1',
        port: '3306',
        username: 'admin',
        password: '@12345admin',
        database: 'new_schema',
        dialect: 'mysql'
    },
    {
        host: 'db4free.net',
        port: '3306',
        username: 'tytnguyen',
        password: '1q2w3e4r5t',
        database: 'exchangeweb',
        dialect: 'mysql'
    },
];

module.exports = DBConnectorSetting;