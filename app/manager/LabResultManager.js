const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Stakeholder = require('../models/Stakeholder');
const SubCategory = require('../models/SubCategory');
const LabResult = require('../models/LabResult');
const moment = require('moment');
const MatchHashtag = require('../models/MatchHashtag');
const Hashtag = require('../models/Hashtag');

Stakeholder.hasMany(LabResult, {foreignKey: 'lid'});
LabResult.belongsTo(Stakeholder, {foreignKey: 'lid'});

LabResult.belongsTo(SubCategory, {foreignKey: 'subcategory_id'});
SubCategory.hasMany(LabResult);

MatchHashtag.belongsTo(LabResult, {foreignKey: 'result_id'});
MatchHashtag.belongsTo(Hashtag, {foreignKey: 'hashtag_id'});
LabResult.hasMany(MatchHashtag, {foreignKey: 'result_id'});
Hashtag.hasMany(MatchHashtag, {foreignKey: 'hashtag_id'});

module.exports = {
    create: function (accessUserId, accessUserType, data, callback) {
        try {
            let queryObj = {};

            // if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
            //     return callback(4, 'invalid_user_right', 403, 'you must be admin to do this process', null);
            // }

            if ( !Pieces.VariableBaseTypeChecking(data.title,'string')
                || !Validator.isLength(data.title, {min: 4, max: 128}) ) {
            return callback(4, 'invalid_title_name', 400, 'title is not alphanumeric and 4 - 128 characters', null);
            } else {
                queryObj.title = data.title;
            }

            if ( !Pieces.VariableBaseTypeChecking(data.ids,'string')
                    || !Validator.isJSON(data.ids) ) {
                return callback(4, 'invalid_hashtag_ids', 400, 'hashtag id list is not a json array string');
            }
           
            let idLists = Pieces.safelyParseJSON(data.ids);
            let match = [];
            for (let value of idLists) {
                match.push([value])
            }

            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.createdAt = moment(Date.now()).add(7, "hour");
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");

            queryObj.lid = data.lid;
            queryObj.subcategory_id = data.subcategory_id;
            queryObj.description = data.description;
            queryObj.status = Constant.STATUS.YES;

            LabResult.create(queryObj).then(labresult => {
                "use strict";
                const convertedData = match.map(arrObj => {
                    return {
                        result_id: labresult.id,
                        hashtag_id: arrObj[0],
                        status: 1,
                        createdBy: accessUserId,
                        updatedBy: accessUserId,
                        createdAt: moment(Date.now()).add(7, "hour"),
                        updatedAt: moment(Date.now()).add(7, "hour"),
                    }
                })

                MatchHashtag.bulkCreate(convertedData).then(result => {
                    "use strict";
                    return callback(null, null, 200, null, labresult);
                }).catch(function(error) {
                "use strict";
                return callback(4, 'create_labresult_fail', 400, error, null);
            });
            }).catch(function(error) {
                "use strict";
                return callback(4, 'create_labresult_fail', 400, error, null);
            });
            }catch(error) {
                return callback(4, 'create_labresult_fail', 400, error, null);
        }
    },

    getOne: function(accessUserId, accessUserType, id, callback) {
        try {
            let where = {};
            let attributes = ['id', 'title','description','status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(4, 'invalid_labresult_id', 400, 'labresult id is incorrect', null);
            }

            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                where.createdBy = accessUserId;
                // where.status = { [Sequelize.Op.ne]: Constant.STATUS.NO };
            }

            where = {id: id};
            
            LabResult.findOne({
                where: where,
                include: [{
                    model: Stakeholder,
                    attributes: ['id', 'name']
                },
                {
                    model: SubCategory,
                    attributes: ['id', 'subject']
                },
                {
                    model: MatchHashtag,
                    include: [{
                        model: Hashtag,
                        attributes: ["value", "type"] 
                    }],
                    attributes: ["hashtag_id"]
                }],
                attributes: attributes
            }).then(result=>{
                "use strict";
                if(result){
                    return callback(null, null, 200, null, result);
                }else{
                    return callback(4, 'find_one_labresult_fail', 404, null, null);
                }
            }).catch(function(error) {
                "use strict";
                return callback(4, 'find_one_labresult_fail', 400, error, null);
            });
        }catch(error){
            return callback(4, 'find_one_labresult_fail', 400, error, null);
        }
    },

    getStatistic: function(accessUserId, accessUserType, callback) {
        try {
            let final = {};
            final = {activated: 0, deleted: 0, total: 0};
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(null, null, 200, null, final);
            }

            LabResult.count({
                where:{},
            }).then(function(total){
                "use strict";
                final.total = total;
                LabResult.count({
                    where:{status: 1},
                }).then(function(status){
                    final.activated = status;
                    LabResult.count({
                        where:{status: 0},
                    }).then(function(status1) {
                        final.deleted = status1;
                        return callback(null, null, 200, null, final);
                    }).catch(function(error) {
                        "use strict";
                        return callback(4, 'count_labresult_fail', 400, error, null);
                    });
                }).catch(function(error){
                    "use strict";
                    return callback(4, 'count_labresult_fail', 400, error, null);
                });
            }).catch(function(error){
                "use strict";
                return callback(4, 'count_labresult_fail', 400, error, null);
            });
        }catch(error){
            return callback(4, 'statistic_labresult_fail', 400, error, null);
        }
    },

    getAll: function(accessUserId, accessUserType, queryContent, callback) {
        try {
            let where = {};
            let con1 = {};
            let page = 1;
            let perPage = Constant.DEFAULT_PAGING_SIZE;
            let sort = [];
            let attributes = ['id', 'title','description','status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            this.parseFilter(accessUserId, accessUserType, where, queryContent.filter);
            if (Pieces.VariableBaseTypeChecking(queryContent.lid, 'string')) {
                where.cid = queryContent.lid;
            }

            if (Pieces.VariableBaseTypeChecking(queryContent.subcategory_id, 'string')) {
                where.subcategory_id = queryContent.subcategory_id;
            }

            if (Pieces.VariableBaseTypeChecking(queryContent.title, 'string')) {
                where.title = { [Sequelize.Op.like]: queryContent.title };
            }

            if (Pieces.VariableBaseTypeChecking(queryContent.status, 'string')) {
                where.status = queryContent.status;
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
            LabResult.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort,
                include: [{
                    model: Stakeholder,
                    attributes: ['id', 'name']
                },
                {
                    model: SubCategory,
                    attributes: ['id', 'subject']
                },
                {
                    model: MatchHashtag,
                    include: [{
                        model: Hashtag,
                        attributes: ["value", "type"] 
                    }],
                    attributes: ["hashtag_id"]
                }],
                attributes: attributes
            }).then((data) => {
                let pages = Math.ceil(data.count / perPage);
                let result = data.rows;
                let output = {
                    data: result,
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
                return callback(4, 'find_and_count_all_labresult_fail', 420, error, null);
            });
        } catch(error) {
            return callback(4, 'get_all_labresult_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserType, labresultId, updateData, callback) {
        try {
            let queryObj = {};
            let where = {};

            if ( !( Pieces.VariableBaseTypeChecking(labresultId,'string')
                    && Validator.isInt(labresultId) )
                && !Pieces.VariableBaseTypeChecking(labresultId,'number') ){
                return callback(3, 'invalid_labresult_id', 400, 'labresult id is incorrect', null);
            }

            if ( updateData.status === Constant.STATUS.YES || updateData.status === Constant.STATUS.NO ) {
                queryObj.status = updateData.status;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.title,'string')
                || Validator.isLength(updateData.title, {min: 4, max: 128}) ) {
                    queryObj.title = updateData.title;
            }

            if ( !Pieces.VariableBaseTypeChecking(updateData.delete_ids,'string')
                    || !Validator.isJSON(updateData.delete_ids) ) {
                return callback(4, 'invalid_delete_ids', 400, 'delete id list is not a json array string');
            }

            if ( !Pieces.VariableBaseTypeChecking(updateData.ids,'string')
            || !Validator.isJSON(updateData.ids) ) {
                return callback(4, 'invalid_update_ids', 400, 'update id list is not a json array string');
            }

            let idLists = Pieces.safelyParseJSON(updateData.delete_ids);
            let deletewhere = {result_id: labresultId, hashtag_id: {[Sequelize.Op.in]: idLists}};
            let deleteObj = {status: Constant.STATUS.NO};

            let idList = Pieces.safelyParseJSON(updateData.ids);
            let match = [];
            for (let value of idList) {
                match.push([value])
            }

            queryObj.mainsubjectId = updateData.mainsubjectId;
            queryObj.subtypeId = updateData.subtypeId;
            queryObj.typeId = updateData.typeId;
            queryObj.locationId = updateData.locationId;
            queryObj.description = updateData.description;

            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");
            where.id = labresultId;

            LabResult.update(
                queryObj,
                {where: where}).then(result=>{
                    "use strict";
                    MatchHashtag.destroy(
                        {where: deletewhere}).then(data => {
                            "use strict";
                            const convertedData = match.map(arrObj => {
                                return {
                                    result_id: labresultId,
                                    hashtag_id: arrObj[0],
                                    status: 1,
                                    createdBy: accessUserId,
                                    updatedBy: accessUserId,
                                    createdAt: moment(Date.now()).add(7, "hour"),
                                    updatedAt: moment(Date.now()).add(7, "hour"),
                                }
                            })
                            MatchHashtag.bulkCreate(convertedData).then(result => {
                                "use strict";
                                return callback(null, null, 200, null, result);
                            }).catch(function(error) {
                            "use strict";
                            return callback(4, 'create_profile_fail', 400, error, null);
                        });
                        }).catch(function(error){
                            "use strict";
                            return callback(3, 'update_profile_fail', 420, error, null);
                        });
            }).catch(function(error){
                "use strict";
                return callback(3, 'update_labresult_fail', 420, error, null);
            });
        }catch(error){
            return callback(3, 'update_labresult_fail', 400, error, null);
        }
    },

    deletes: function (accessUserId, accessUserType, ids, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(ids,'string')
                    || !Validator.isJSON(ids) ) {
                return callback(3, 'invalid_labresult_ids', 400, 'labresult id list is not a json array string');
            }

            let idLists = Pieces.safelyParseJSON(ids);

            let where = {id: {[Sequelize.Op.in]: idLists}};

            let queryObj = {status: Constant.STATUS.NO};

            LabResult.update(queryObj, {where: where}).then(result=>{
                "use strict";
                MatchHashtag.update(queryObj, {where: {result_id: {[Sequelize.Op.in]: idLists}}}).then(result=>{
                    "use strict";
                    return callback(null, null, 200, null);
                }).catch(function(error){
                    "use strict";
                    return callback(3, 'update_match_hashtag_fail', 420, error);
                });   
            }).catch(function(error){
                "use strict";
                return callback(3, 'update_labresult_fail', 420, error);
            });
        }catch(error){
            return callback(3, 'deletes_labresult_fail', 400, error);
        }
    },

    delete: function(accessUserId, accessUserType, id, callback) {
        try {
            let queryObj = {};
            let where = {};

            if ( (accessUserId !== id) && (accessUserType < Constant.USER_TYPE.MODERATOR) ) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(3, 'invalid_labresult_id', 400, 'labresult id is incorrect', null);
            }

            where = { id: id };
            queryObj = { status: Constant.STATUS.NO };

            LabResult.findOne({where:where}).then(labresult =>{
                "use strict";
                if ( labresult && labresult.status === Constant.STATUS.NO ){
                    LabResult.destroy({where: where}).then(result => {
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        return callback(3, 'remove_labresult_fail', 420, error);
                    });
                }else {
                    LabResult.update(queryObj, {where: where}).then(result=>{
                        "use strict";
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        return callback(3, 'update_labresult_fail', 420, error);
                    })
                }
            }).catch(function(error){
                "use strict";
                return callback(3, 'find_one_labresult_fail', 400, error, null);
            });
        }catch(error){
            return callback(3, 'delete_labresult_fail', 400, error);
        }
    },

    // --------- others ----------
    parseFilter: function(accessUserId, accessUserType, condition, filters) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(filters,'string')
                || !Validator.isJSON(filters) ) {
                return false;
            }

            let aDataFilter = Pieces.safelyParseJSON1(filters);
            if( aDataFilter && (aDataFilter.length > 0) ){
                for(let i = 0; i < aDataFilter.length; i++ ){
                    if ( !Pieces.VariableBaseTypeChecking(aDataFilter[i].key, 'string')
                        || !Pieces.VariableBaseTypeChecking(aDataFilter[i].operator, 'string')
                        || aDataFilter[i].value === null
                        || aDataFilter[i].value === undefined ){
                        continue;
                    }

                    if ( aDataFilter[i].key === 'activated'
                        && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=') )
                        && (aDataFilter[i].value === Constant.ACTIVATED.YES || aDataFilter[i].value === Constant.ACTIVATED.NO) ) {
                        switch(aDataFilter[i].operator){
                            case '=':
                                condition[aDataFilter[i].key] = aDataFilter[i].value;
                                break;
                            case '!=':
                                condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                break;
                        }
                        continue;
                    }

                    if ( aDataFilter[i].key === 'type'
                        && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=') )
                        && Pieces.ValidObjectEnum(aDataFilter[i].value, Constant.USER_TYPE) ) {
                        switch(aDataFilter[i].operator){
                            case '=':
                                condition[aDataFilter[i].key] = aDataFilter[i].value;
                                break;
                            case '!=':
                                condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                break;
                        }
                        continue;
                    }

                    if ( (aDataFilter[i].key === 'createdAt') &&
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
                        if( aDataFilter[i].operator !== 'in'
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'string')
                            && Validator.isISO8601(aDataFilter[i].value) ){
                            switch(aDataFilter[i].operator){
                                case '=':
                                    condition[aDataFilter[i].key] = {$eq: aDataFilter[i].value};
                                    break;
                                case '!=':
                                    condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                    break;
                                case '>':
                                    condition[aDataFilter[i].key] = {$gt: aDataFilter[i].value};
                                    break;
                                case '>=':
                                    condition[aDataFilter[i].key] = {$gte: aDataFilter[i].value};
                                    break;
                                case '<':
                                    condition[aDataFilter[i].key] = {$lt: aDataFilter[i].value};
                                    break;
                                case '<=':
                                    condition[aDataFilter[i].key] = {$lte: aDataFilter[i].value};
                                    break;
                            }
                        }else if(aDataFilter[i].operator === 'in'){
                            if(aDataFilter[i].value.length === 2
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], 'string')
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], 'string')
                                && Validator.isISO8601(aDataFilter[i].value[0])
                                && Validator.isISO8601(aDataFilter[i].value[1]) ){
                                condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
                            }
                        }
                        continue;
                    }

                    if ( (aDataFilter[i].key === 'updatedAt') &&
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
                        if( aDataFilter[i].operator !== 'in'
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'string')
                            && Validator.isISO8601(aDataFilter[i].value) ){
                            switch(aDataFilter[i].operator){
                                case '=':
                                    condition[aDataFilter[i].key] = {$eq: aDataFilter[i].value};
                                    break;
                                case '!=':
                                    condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                    break;
                                case '>':
                                    condition[aDataFilter[i].key] = {$gt: aDataFilter[i].value};
                                    break;
                                case '>=':
                                    condition[aDataFilter[i].key] = {$gte: aDataFilter[i].value};
                                    break;
                                case '<':
                                    condition[aDataFilter[i].key] = {$lt: aDataFilter[i].value};
                                    break;
                                case '<=':
                                    condition[aDataFilter[i].key] = {$lte: aDataFilter[i].value};
                                    break;
                            }
                        }else if(aDataFilter[i].operator === 'in'){
                            if(aDataFilter[i].value.length === 2
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], 'string')
                                && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], 'string')
                                && Validator.isISO8601(aDataFilter[i].value[0])
                                && Validator.isISO8601(aDataFilter[i].value[1]) ){
                                condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
                            }
                        }
                    }
                }
            }else{
                return false;
            }
        }catch (error){
            return false;
        }
    }    
}