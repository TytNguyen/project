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
                return callback(4, 'invalid_user_right', 400, 'Only admin can do this action', null);
            }

            let queryObj = {};
            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.createdAt = moment(Date.now());
            queryObj.updatedAt = moment(Date.now());

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

    getAll: function(accessUserId, accessUserType, queryContent, callback) {
        try {
            let where = {};
            let con1 = {};
            let page = 1;
            let perPage = Constant.DEFAULT_PAGING_SIZE;
            let sort = [];

            this.parseFilter(accessUserId, accessUserType, where, queryContent.filter);
            if (Pieces.VariableBaseTypeChecking(queryContent.type, 'string')) {
                where.type = queryContent.type;
            }

            if( (Pieces.VariableBaseTypeChecking(queryContent['page'], 'string') && Validator.isInt(queryContent['page']))
            || (Pieces.VariableBaseTypeChecking(queryContent['page'], 'number')) ){
            page = parseInt(queryContent['page']);
            if(page === 0){
                page = 1;
            }
        }

            if( (Pieces.VariableBaseTypeChecking(queryContent['perPage'], 'string') && Validator.isInt(queryContent['perPage']))
                || (Pieces.VariableBaseTypeChecking(queryContent['perPage'], 'number')) ){
                perPage = parseInt(queryContent['perPage']);
                if(perPage <= 0){
                    perPage = Constant.DEFAULT_PAGING_SIZE;
                }
            }

            Pieces.splitAndAssignValueForSort(sort, queryContent['sort']);
            if(sort.length <= 0){
                sort.push(['updatedAt', 'DESC']);
            }

            let offset = perPage * (page - 1);
            Hashtag.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort
            }).then(data=>{
                "use strict";
                let pages = Math.ceil(data.count / perPage);
                let meeting = data.rows;
                let output = {
                    data: meeting,
                    pages: {
                        current: page,
                        prev: page - 1,
                        hasPrev: false,
                        next: (page + 1) > pages ? 0 : (page + 1),
                        hasNext: false,
                        total: pages
                    },
                    items: {
                        begin: ((page * perPage) - perPage) + 1,
                        end: page * perPage,
                        total: data.count
                    }
                };
                output.pages.hasNext = (output.pages.next !== 0);
                output.pages.hasPrev = (output.pages.prev !== 0);
                return callback(null, null, 200, null, output);
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
            queryObj.updatedAt = moment(Date.now());
            
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


    // --------- others ----------
    parseFilter: function (accessUserId, accessUserType, condition, filters) {
        try {
            if (!Pieces.VariableBaseTypeChecking(filters, 'string')
                || !Validator.isJSON(filters)) {
                return false;
            }

            let aDataFilter = Pieces.safelyParseJSON1(filters);
            if (aDataFilter && (aDataFilter.length > 0)) {
                for (let i = 0; i < aDataFilter.length; i++) {
                    if (!Pieces.VariableBaseTypeChecking(aDataFilter[i].key, 'string')
                        || !Pieces.VariableBaseTypeChecking(aDataFilter[i].operator, 'string')
                        || aDataFilter[i].value === null
                        || aDataFilter[i].value === undefined) {
                        continue;
                    }

                    if (aDataFilter[i].key === 'activated'
                        && ((aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!='))
                        && (aDataFilter[i].value === Constant.ACTIVATED.YES || aDataFilter[i].value === Constant.ACTIVATED.NO)) {
                        switch (aDataFilter[i].operator) {
                            case '=':
                                condition[aDataFilter[i].key] = aDataFilter[i].value;
                                break;
                            case '!=':
                                condition[aDataFilter[i].key] = { $ne: aDataFilter[i].value };
                                break;
                        }
                        continue;
                    }

                    if (aDataFilter[i].key === 'type'
                        && ((aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!='))
                        && Pieces.ValidObjectEnum(aDataFilter[i].value, Constant.USER_TYPE)) {
                        switch (aDataFilter[i].operator) {
                            case '=':
                                condition[aDataFilter[i].key] = aDataFilter[i].value;
                                break;
                            case '!=':
                                condition[aDataFilter[i].key] = { $ne: aDataFilter[i].value };
                                break;
                        }
                        continue;
                    }

                    if ((aDataFilter[i].key === 'createdAt') &&
                        (
                            (aDataFilter[i].operator === '=')
                            || (aDataFilter[i].operator === '!=')
                            || (aDataFilter[i].operator === '<')
                            || (aDataFilter[i].operator === '>')
                            || (aDataFilter[i].operator === '<=')
                            || (aDataFilter[i].operator === '>=')
                            || (aDataFilter[i].operator === 'in')
                        )
                    ) {
                        if (aDataFilter[i].operator !== 'in'
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'string')
                            && Validator.isISO8601(aDataFilter[i].value)) {
                            switch (aDataFilter[i].operator) {
                                case '=':
                                    condition[aDataFilter[i].key] = { $eq: aDataFilter[i].value };
                                    break;
                                case '!=':
                                    condition[aDataFilter[i].key] = { $ne: aDataFilter[i].value };
                                    break;
                                case '>':
                                    condition[aDataFilter[i].key] = { $gt: aDataFilter[i].value };
                                    break;
                                case '>=':
                                    condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value };
                                    break;
                                case '<':
                                    condition[aDataFilter[i].key] = { $lt: aDataFilter[i].value };
                                    break;
                                case '<=':
                                    condition[aDataFilter[i].key] = { $lte: aDataFilter[i].value };
                                    break;
                            }
                        } else if (aDataFilter[i].operator === 'in') {
                            if (aDataFilter[i].value.length === 2
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], 'string')
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], 'string')
                                && Validator.isISO8601(aDataFilter[i].value[0])
                                && Validator.isISO8601(aDataFilter[i].value[1])) {
                                condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
                            }
                        }
                        continue;
                    }

                    if ((aDataFilter[i].key === 'updatedAt') &&
                        (
                            (aDataFilter[i].operator === '=')
                            || (aDataFilter[i].operator === '!=')
                            || (aDataFilter[i].operator === '<')
                            || (aDataFilter[i].operator === '>')
                            || (aDataFilter[i].operator === '<=')
                            || (aDataFilter[i].operator === '>=')
                            || (aDataFilter[i].operator === 'in')
                        )
                    ) {
                        if (aDataFilter[i].operator !== 'in'
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'string')
                            && Validator.isISO8601(aDataFilter[i].value)) {
                            switch (aDataFilter[i].operator) {
                                case '=':
                                    condition[aDataFilter[i].key] = { $eq: aDataFilter[i].value };
                                    break;
                                case '!=':
                                    condition[aDataFilter[i].key] = { $ne: aDataFilter[i].value };
                                    break;
                                case '>':
                                    condition[aDataFilter[i].key] = { $gt: aDataFilter[i].value };
                                    break;
                                case '>=':
                                    condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value };
                                    break;
                                case '<':
                                    condition[aDataFilter[i].key] = { $lt: aDataFilter[i].value };
                                    break;
                                case '<=':
                                    condition[aDataFilter[i].key] = { $lte: aDataFilter[i].value };
                                    break;
                            }
                        } else if (aDataFilter[i].operator === 'in') {
                            if (aDataFilter[i].value.length === 2
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], 'string')
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], 'string')
                                && Validator.isISO8601(aDataFilter[i].value[0])
                                && Validator.isISO8601(aDataFilter[i].value[1])) {
                                condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
                            }
                        }
                    }
                }
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}