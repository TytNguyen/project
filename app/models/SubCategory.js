const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const Category = require('./Category');
const User = require('./User');

let SubCategory = MySequelize.define('subcategory', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    subject: {
        type: Sequelize.STRING(64),
        allowNull: true
    },
    categoryid: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        references: {
            model: Category,
            key: 'id'
        }
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
    tableName: 'subcategory'
});

// Stakeholder.hasMany(EnterpriseProfile, {foreignKey: 'cid'});
// EnterpriseProfile.belongsTo(Stakeholder, {foreignKey: 'cid'});

module.exports = SubCategory;