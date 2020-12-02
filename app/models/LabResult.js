const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const User = require('./User');
const Stakeholder = require('./Stakeholder');
const Category = require('./Category');

let LabResult = MySequelize.define('labresult', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    lid: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: Stakeholder,
            key: 'id'
        }
    },
    title: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    subcategory_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    },
    description: {
        type: Sequelize.STRING(200),
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
    tableName: 'labresult'
});

// Stakeholder.hasMany(LabResult, {foreignKey: 'lid'});
// LabResult.belongsTo(Stakeholder, {foreignKey: 'lid'});

module.exports = LabResult;