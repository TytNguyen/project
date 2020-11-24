const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const User = require('./User');

let Hashtag = MySequelize.define('hashtag', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    value: {
        type: Sequelize.STRING(64),
        allowNull: true
    },
    type: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
    },
    status: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        default: 1
    },
    createdBy: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    updatedBy: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    underscored: true,
    timestamps: false,
    updatedAt: false,
    createdAt: false,
    includeDeleted: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'hashtag'
});

module.exports = Hashtag;