const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Meeting = require('../models/Meeting');
const moment = require('moment');
const Category = require('../models/Category');
const cloudinary = require('../middlewares/Cloudinary');

Meeting.belongsTo(Category);
Category.hasMany(Meeting);

module.exports = {
    getOne: function(accessUserId, accessUserType, id, callback) {
        try {
            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(4, 'invalid_meeting_id', 400, 'meeting id is incorrect', null);
            }

            let where = {};
            let attributes = ['id', 'title','description', 'begin', 'end', 'limited', 'currentAttend', 'status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            where = {id: id};
            
            Meeting.findOne({
                where: where,
                include: [{
                    model: Category,
                    attributes: ['id', 'mainsubject'],
                }]
            }).then(result=>{
                "use strict";
                if(result){
                    return callback(null, null, 200, null, result);
                }else{
                    return callback(4, 'find_one_meeting_fail', 404, null, null);
                }
            }).catch(function(error) {
                "use strict";
                return callback(4, 'find_one_meeting_fail', 400, error, null);
            });
        }catch(error){
            return callback(4, 'find_one_meeting_fail', 400, error, null);
        }
    },
    
    getStatistic: function(accessUserId, accessUserType, callback) {
        try {
            let final = {};
            final = {activated: 0, deleted: 0, total: 0};
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(4, 'invalid_user_right', 400, error, null);
            }

            Meeting.count({
                where:{},
            }).then(function(total){
                "use strict";
                final.total = total;
                Meeting.count({
                    where:{status: 1},
                }).then(function(status){
                    final.activated = status;
                    Meeting.count({
                        where:{status: 0},
                    }).then(function(status1) {
                        final.deleted = status1;
                        return callback(null, null, 200, null, final);
                    }).catch(function(error) {
                        "use strict";
                        return callback(4, 'count_meeting_fail', 400, error, null);
                    });
                }).catch(function(error){
                    "use strict";
                    return callback(4, 'count_meeting_fail', 400, error, null);
                });
            }).catch(function(error){
                "use strict";
                return callback(4, 'count_meeting_fail', 400, error, null);
            });
        }catch(error){
            return callback(4, 'statistic_meeting_fail', 400, error, null);
        }
    },

    getAll: function(accessUserId, accessUserType, queryContent, callback) {
        try {
            // if(accessUserType < Constant.USER_TYPE.MODERATOR) {
            //     return callback(4, 'invalid_user_type', 400, null, null);
            // }

            let where;
            let con1 = {};
            let page = 1;
            let perPage = Constant.DEFAULT_PAGING_SIZE;
            let sort = [];
            let attributes = ['id', 'title','description', 'begin', 'end', 'limited', 'currentAttend', 'status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            this.parseFilter(accessUserId, accessUserType, where, queryContent.filter);
            if( Pieces.VariableBaseTypeChecking(queryContent.title, 'string') ){
                where.title = {[Sequelize.Op.like]: queryContent.title};
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.description, 'string') ){
                where.description = {[Sequelize.Op.like]: queryContent.description};
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.category_id, 'string') ){
                where.category_id = queryContent.category_id;
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.begin, 'string') ){
                where.begin = queryContent.begin;
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.status, 'string') ){
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
            Meeting.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort,
                include: [{
                    model: Category,
                    attributes: ['mainsubject'],
                }]
            }).then((data) => {
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
                return callback(4, 'find_and_count_all_meeting_fail', 420, error, null);
            });
        } catch(error) {
            return callback(4, 'get_all_meeting_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserType, data, file, callback) {
        try {
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(4, 'invalid_user_right', 403, 'you must be admin to do this process', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(data.title,'string')
                || !Validator.isLength(data.title, {min: 4, max: 128}) ) {
            return callback(4, 'invalid_title_name', 400, 'title is not alphanumeric and 4 - 128 characters', null);
            }

            let queryObj = {};
            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.createdAt = moment(Date.now());
            queryObj.updatedAt = moment(Date.now());

            queryObj.title = data.title;
            queryObj.description = data.description;
            queryObj.category_id = data.category_id;
            queryObj.status = Constant.STATUS.YES;
            queryObj.begin = moment(data.begin);
            queryObj.end = moment(data.end);
            queryObj.limited = data.limited;
            queryObj.currentAttend = data.currentAttend;    
            queryObj.address = data.address; 

            if (file === undefined || file.length === 0) {
                Meeting.create(queryObj).then(meeting => {
                    "use strict";
                    return callback(null, null, 200, null, meeting);
                }).catch(function(error) {
                    "use strict";
                    return callback(4, 'create_meeting_fail', 400, error, null);
                });
            } else {
                cloudinary.uploadMultiple(file, 'meeting', result => {
                    queryObj.banner = result[0][0];
                    queryObj.banner_location = result[0][1];
    
                    Meeting.create(queryObj).then(meeting => {
                        "use strict";
                        return callback(null, null, 200, null, meeting);
                        }).catch(function(error) {
                            "use strict";
                            return callback(4, 'create_meeting_fail', 400, error, null);
                        });
                    }).catch(function (error) {
                        "use strict";
                        return callback(1, 'create_avatar_fail', 420, error, null);
                    });
            }
            }catch(error) {
                return callback(4, 'create_meeting_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserType, meetingId, updateData, file, callback) {
        try {
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            if ( !( Pieces.VariableBaseTypeChecking(meetingId,'string')
                    && Validator.isInt(meetingId) )
                && !Pieces.VariableBaseTypeChecking(meetingId,'number') ){
                return callback(4, 'invalid_meeting_id', 400, 'meeting id is incorrect', null);
            }

            if ( updateData.status === Constant.STATUS.YES || updateData.status === Constant.STATUS.NO ) {
                queryObj.status = updateData.status;
            }

            if ( updateData.title !== undefined
                && Validator.isLength(updateData.title, {min: 4, max: 128}) ) {
                    queryObj.title = updateData.title;
            }

            if (updateData.description !== undefined) {
                queryObj.description = updateData.description;
            }

            if (updateData.category_id !== undefined) {
                queryObj.category_id = updateData.category_id;
            }
            
            if (updateData.limited !== undefined) {
                queryObj.limited = updateData.limited;
            }

            queryObj.begin = moment(updateData.begin);
            queryObj.end = moment(updateData.end);
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now());
            
            // queryObj.currentAttend = updateData.currentAttend;

            where.id = meetingId;

            if (file === undefined || file.length === 0) {
                Meeting.update(
                    queryObj,
                    {where: where}).then(result=>{
                        "use strict";
                        if( (result !== null) && (result.length > 0) && (result[0] > 0) ){
                            return callback(null, null, 200, null, meetingId);
                        }else{
                            return callback(4, 'update_meeting_fail', 400, '', null);
                        }
                }).catch(function(error){
                    "use strict";
                    return callback(4, 'update_meeting_fail', 420, error, null);
                });
            } else {
                Meeting.findOne({
                    where: where,
                    attributes: ['banner_location'],
                }).then(result => {
                    "use strict";
                    if (result.banner_location !== null) {
                        let banner = [result.banner_location]
                        cloudinary.deleteImage(banner, result => {
                            // callback(null, null, 200, null, result);
                            cloudinary.uploadMultiple(file, 'meeting', result => {
                                queryObj.banner = result[0][0];
                                queryObj.banner_location = result[0][1];

                                Meeting.update(
                                    queryObj,
                                    { where: where }).then(result => {
                                        "use strict";
                                        if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                                            return callback(null, null, 200, null, meetingId);
                                        } else {
                                            return callback(1, 'update_meeting_fail', 400, '', null);
                                        }
                                    }).catch(function (error) {
                                        "use strict";
                                        return callback(1, 'update_meeting_fail', 420, error, null);
                                    });
                                }).catch(function (error) {
                                    "use strict";
                                    return callback(1, 'create_avatar_fail', 420, error, null);
                                });
                            }).catch(function (error) {
                                "use strict";
                                return callback(1, 'delete_avatar_fail', 420, error, null);
                            });
                    } else {
                        cloudinary.uploadMultiple(file, 'meeting', result => {
                            queryObj.banner = result[0][0];
                            queryObj.banner_location = result[0][1];

                            Meeting.update(
                                queryObj,
                                { where: where }).then(result => {
                                    "use strict";
                                    if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                                        return callback(null, null, 200, null, meetingId);
                                    } else {
                                        return callback(1, 'update_meeting_fail', 400, '', null);
                                    }
                                }).catch(function (error) {
                                    "use strict";
                                    return callback(1, 'update_meeting_fail', 420, error, null);
                                });
                        }).catch(function (error) {
                            "use strict";
                            return callback(1, 'create_avatar_fail', 420, error, null);
                        });
                    }
                }).catch(function (error) {
                    "use strict";
                    return callback(1, 'update_meeting_fail', 420, error, null);
                });
            }
        }catch(error){
            return callback(4, 'update_meeting_fail', 400, error, null);
        }
    },

    deletes: function (accessUserId, accessUserType, ids, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(ids,'string')
                    || !Validator.isJSON(ids) ) {
                return callback(4, 'invalid_meeting_ids', 400, 'meeting id list is not a json array string');
            }
            if(accessUserType < Constant.USER_TYPE.MODERATOR){
                return callback(4, 'invalid_user_right', 403, null);
            }

            let idLists = Pieces.safelyParseJSON(ids);

            let where = {id: {[Sequelize.Op.in]: idLists}};

            let queryObj = {status: Constant.STATUS.NO};

            Meeting.update(queryObj, {where: where}).then(result=>{
                "use strict";
                if ( result && (result.length > 0) && result[0] > 0 ) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(4, 'invalid_meeting_request', 404, null);
                }
            }).catch(function(error){
                "use strict";
                return callback(4, 'update_meeting_fail', 420, error);
            });
        }catch(error){
            return callback(4, 'deletes_meeting_fail', 400, error);
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
                return callback(4, 'invalid_user_id', 400, 'user id is incorrect', null);
            }

            where = { id: id };
            queryObj = { status: Constant.STATUS.NO };

            Meeting.findOne({where:where}).then(meeting =>{
                "use strict";
                if ( meeting && meeting.status === Constant.STATUS.NO ){
                    Meeting.destroy({where: where}).then(result => {
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        return callback(4, 'remove_meeting_fail', 420, error);
                    });
                }else {
                    Meeting.update(queryObj, {where: where}).then(result=>{
                        "use strict";
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        return callback(4, 'update_meeting_fail', 420, error);
                    })
                }
            }).catch(function(error){
                "use strict";
                return callback(4, 'find_one_meeting_fail', 400, error, null);
            });
        }catch(error){
            return callback(4, 'delete_meeting_fail', 400, error);
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
};