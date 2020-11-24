const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');

let User = MySequelize.define('user', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING(64),
        allowNull: true,
        default: null
    },
    lastName: {
        type: Sequelize.STRING(64),
        allowNull: true,
        default: null
    },
    displayName: {
        type: Sequelize.STRING(64),
        allowNull: true,
        default: null
    },
    image: {
        type: Sequelize.STRING(200),
        allowNull: true,
        default: null
    },
    type: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        default: 1
    },
    status: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        default: 1
    },
    createdBy: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
            model: this.User,
            key: 'id'
        }
    },
    updatedBy: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
            model: this.User,
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
    tableName: 'user'
});

module.exports = User;