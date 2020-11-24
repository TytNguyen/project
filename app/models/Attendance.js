const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const User = require('./User');
const Meeting = require('./Meeting');
const Stakeholder = require('./Stakeholder');

let Attendance = MySequelize.define('attendance', {
    mid: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        references: {
            model: Meeting,
            key: 'id'
        }
    },
    sid: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        references: {
            model: Stakeholder,
            key: 'id'
        }
    },
    status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
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
    tableName: 'attendance'
});

Meeting.belongsToMany(Stakeholder, { through: Attendance });
Stakeholder.belongsToMany(Meeting, { through: Attendance });


module.exports = Attendance;