const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Hashtag = require('../models/Hashtag');
const moment = require('moment');

module.exports = {
    create: function (accessUserId, accessUserType, data, callback) {
        try {
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(4, 'invalid_category_id', 400, 'category id is incorrect', null);
            }

            let queryObj = {};
            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.createdAt = moment(Date.now()).add(7, "hour");
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");

            queryObj.value = data.value;
            queryObj.type = data.type;

            if (data.status == Constant.STATUS.YES || data.status == Constant.STATUS.NO) {
                queryObj.status = data.status;
            } else
                queryObj.status = Constant.STATUS.YES;

            Hashtag.create(queryObj).then(hashtag => {
                "use strict";
                return callback(null, null, 200, null, hashtag);
            }).catch(function(error) {
                "use strict";
                return callback(3, 'create_category_fail', 400, error, null);
            });
            }catch(error) {
                return callback(3, 'create_category_fail', 400, error, null);
        }
    },

    getAll: function(accessUserId, accessUserType, column, callback) {
        try {
            // if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
            //     return callback(4, 'invalid_user_right', 403, 'you must be admin to do this process', null);
            // }

            let where = {};
            
            Hashtag.findAndCountAll({
                where: where,
            }).then(result=>{
                "use strict";
                if(result){
                    return callback(null, null, 200, null, result);
                }else{
                    return callback(3, 'find_hashtag_fail', 404, null, null);
                }
            }).catch(function(error) {
                "use strict";
                return callback(3, 'find_hashtag_fail', 400, error, null);
            });
        }catch(error){
            return callback(3, 'find_hashtag_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserType, hashtagId, updateData, callback) {
        try {
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            if (updateData.value !== undefined) {
                queryObj.value = updateData.value;
            }

            if (updateData.type !== undefined) {
                queryObj.type = updateData.type;
            }
            
            if (updateData.status !== undefined) {
                queryObj.status = updateData.status;
            }

            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");
            
            where.id = hashtagId;

            Hashtag.update(
                queryObj,
                {where: where}).then(result=>{
                    "use strict";
                    if( (result !== null) && (result.length > 0) && (result[0] > 0) ){
                        return callback(null, null, 200, null, hashtagId);
                    }else{
                        return callback(4, 'update_hashtag_fail', 400, '', null);
                    }
            }).catch(function(error){
                "use strict";
                return callback(4, 'update_hashtag_fail', 420, error, null);
            });
        }catch(error){
            return callback(4, 'update_hashtag_fail', 400, error, null);
        }
    },

    deletes: function (accessUserId, accessUserType, ids, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(ids,'string')
                    || !Validator.isJSON(ids) ) {
                return callback(4, 'invalid_hashtag_ids', 400, 'hashtag id list is not a json array string');
            }
            if(accessUserType < Constant.USER_TYPE.MODERATOR){
                return callback(4, 'invalid_user_right', 403, null);
            }

            let idLists = Pieces.safelyParseJSON(ids);

            let where = {id: {[Sequelize.Op.in]: idLists}};

            let queryObj = {status: Constant.STATUS.NO};

            Hashtag.update(queryObj, {where: where}).then(result=>{
                "use strict";
                if ( result && (result.length > 0) && result[0] > 0 ) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(4, 'invalid_hashtag_request', 404, null);
                }
            }).catch(function(error){
                "use strict";
                return callback(4, 'update_hashtag_fail', 420, error);
            });
        }catch(error){
            return callback(4, 'deletes_hashtag_fail', 400, error);
        }
    },

    delete: function(accessUserId, accessUserType, id, callback) {
        try {
            let queryObj = {};
            let where = {};

            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(4, 'invalid_user_right', 403, null);
            }

            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(4, 'invalid_hashtag_id', 400, 'hashtag id is incorrect', null);
            }

            where = { id: id };
            queryObj = { status: Constant.STATUS.NO };

            Hashtag.findOne({where:where}).then(hashtag =>{
                "use strict";
                if ( hashtag && hashtag.status === Constant.STATUS.NO ){
                    Hashtag.destroy({where: where}).then(result => {
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        return callback(4, 'remove_hashtag_fail', 420, error);
                    });
                }else {
                    Hashtag.update(queryObj, {where: where}).then(result=>{
                        "use strict";
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        return callback(4, 'update_hashtag_fail', 420, error);
                    })
                }
            }).catch(function(error){
                "use strict";
                return callback(4, 'find_one_hashtag_fail', 400, error, null);
            });
        }catch(error){
            return callback(4, 'delete_hashtag_fail', 400, error);
        }
    },
}