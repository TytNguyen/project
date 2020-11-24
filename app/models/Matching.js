const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const User = require('./User');
const LabResult = require('./LabResult');
const EnterpriseProfile = require('./EnterpriseProfile');

let Matching = MySequelize.define('matching', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    profileId: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: EnterpriseProfile,
            key: 'id'
        }
    },
    resultId: {
        type: Sequelize.STRING(64),
        allowNull: false,
        references: {
            model: LabResult,
            key: 'id'
        }
    },
    status: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        default: 1
    },
    type: {
        type: Sequelize.TINYINT(1),
        allowNull: true,
        default: 1
    },
    isCompany: {
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
    tableName: 'matching'
});

LabResult.belongsToMany(EnterpriseProfile, { through: Matching, foreignKey: 'profileId' });
EnterpriseProfile.belongsToMany(LabResult, { through: Matching, foreignKey: 'resultId' });

// Matching.associate = function() {
//     Matching.hasMany(Processes, {foreignKey: 'mid'});
// };


module.exports = Matching;