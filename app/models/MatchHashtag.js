const Sequelize = require('sequelize');
const MySequelize = require('../utils/Sequelize');
const User = require('./User');
const EnterpriseProfile = require('./EnterpriseProfile');
const LabResult = require('./LabResult');
const Hashtag = require('./Hashtag');

let MatchHashtag = MySequelize.define('match_hashtag', {
    id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    profile_id: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
            model: EnterpriseProfile,
            key: 'id'
        }
    },
    result_id: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
            model: LabResult,
            key: 'id'
        }
    },
    hashtag_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
            model: Hashtag,
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
    tableName: 'match_hashtag'
});

module.exports = MatchHashtag;