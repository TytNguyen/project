const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const User = require('./User');
const SubCategory = require('./SubCategory');
const Stakeholder = require('./Stakeholder');

let EnterpriseProfile = MySequelize.define('requirement', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cid: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
            model: Stakeholder,
            key: 'id'
        }
    },
    title: {
        type: Sequelize.STRING(200),
        allowNull: true
    },
    subcategory_id: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
            model: SubCategory,
            key: 'id'
        }
    },
    description: {
        type: Sequelize.TEXT,
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
    tableName: 'requirement'
});

module.exports = EnterpriseProfile;