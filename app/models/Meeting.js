const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const Category = require('./Category');
const User = require('./User');

let Meeting = MySequelize.define('meeting', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(200),
        allowNull: true
    },
    category_id: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
            model: Category,
            key: 'id'
        }
    },
    begin: {
        type: Sequelize.DATE,
        allowNull: true
    },
    end: {
        type: Sequelize.DATE,
        allowNull: true
    },
    limited: {
        type: Sequelize.INTEGER(5),
        allowNull: true,
        default: 1
    },
    currentAttend: {
        type: Sequelize.INTEGER(5),
        allowNull: true,
        default: 0
    },
    banner: {
        type: Sequelize.STRING(200),
        allowNull: true,
        default: null
    },
    banner_location: {
        type: Sequelize.STRING(200),
        allowNull: true,
        default: null
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
    tableName: 'meeting'
});

module.exports = Meeting;