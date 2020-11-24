const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const User = require('./User');

let Stakeholder = MySequelize.define('stakeholder', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    taxcode: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    district: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    detailAddress: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    type: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        default: 1
    },
    status: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        default: 1
    },
    createdBy: {
        type: Sequelize.BIGINT(10),
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    updatedBy: {
        type: Sequelize.BIGINT(10),
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
    },

}, {
    underscored: true,
    paranoid: false,
    timestamps: true,
    updatedAt: false,
    createdAt: false,
    includeDeleted: true,
    freezeTableName: true,
    tableName: 'stakeholder'
});

module.exports = Stakeholder;