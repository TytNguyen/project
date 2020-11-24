const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const User = require('./User');
const Matching = require('./matching');

let Processes = MySequelize.define('processes', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    mid: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: Matching,
            key: 'id'
        }
    },
    step: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        default: 1
    },
    note: {
        type: Sequelize.STRING(200),
        allowNull: true,
        default: null
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
    tableName: 'processes'
});

Matching.hasMany(Processes, {foreignKey: 'mid'});
Processes.belongsTo(Matching, {foreignKey: 'mid'});

// Matching.hasMany(Processes);
// Processes.belongsTo(Matching, {foreignKey: 'mid'});



// Processes.associate = function() {
//     Processes.belongsTo(Matching, { foreignKey: 'mid' });
//   };


module.exports = Processes; 