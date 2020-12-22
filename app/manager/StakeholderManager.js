const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Stakeholder = require('../models/Stakeholder');
const moment = require('moment');

module.exports = {
    create: function (accessUserId, accessUserType, data, callback) {
        try {
            if(( accessUserType === 2 && data.type === 1) 
                || (accessUserType === 1 && data.type === 2)) {
                return callback(3, 'invalid_company_rights', 400, 'you do not have user rights to do this process', null);    
            }

            if ( !Pieces.VariableBaseTypeChecking(data.name,'string')
                || !Validator.isLength(data.name, {min: 4, max: 128}) ) {
            return callback(3, 'invalid_company_name', 400, 'name is not alphanumeric and 4 - 128 characters', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(data.taxcode,'string')
                    || !Validator.isLength(data.taxcode, {min: 5, max: 20}) ) {
                return callback(3, 'invalid_taxcode', 400, 'taxcode must have 10 - 20 characters', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(data.district, 'string') ) {
                return callback(3, 'invalid_district', 400,'district is not a string', null);
            }


            if ( !Pieces.VariableBaseTypeChecking(data.detailAddress, 'string') ) {
                return callback(3, 'invalid_detail_address', 400,'detail address is not a string', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(data.phone,'string')
                    || !Validator.isLength(data.phone, {min: 10, max: 20}) ) {
                return callback(3, 'invalid_phonenumber', 400, 'phonenumber must have 10 - 20 characters', null);
            }

            let queryObj = {};
            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;

            queryObj.name = data.name;
            queryObj.taxcode = data.taxcode;
            queryObj.district = data.district;
            queryObj.detailAddress = data.detailAddress;
            queryObj.phone = data.phone;
            queryObj.type = data.type;
            queryObj.createdAt = moment(Date.now());
            queryObj.updatedAt = moment(Date.now());

            queryObj.status = Constant.STATUS.YES;

            Stakeholder.create(queryObj).then(company => {
                "use strict";
                return callback(null, null, 200, null, company);
            }).catch(function(error) {
                "use strict";
                return callback(3, 'create_stakeholder_fail', 400, error, null);
            });
            }catch(error) {
                return callback(3, 'create_stakeholder_fail', 400, error, null);
        }
    },

    getOne: function(accessUserId, accessUserType, id, callback) {
        try {
            let where = {};

            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(3, 'invalid_stakeholder_id', 400, 'stakeholder id is incorrect', null);
            }

            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                where.createdBy = accessUserId;
                // where.status = { [Sequelize.Op.ne]: Constant.STATUS.NO };
            } else {
                where.id = id;
            }

            // let attributes = ['id', 'name','address','phone', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            // if (Pieces.VariableBaseTypeChecking(queryContent.id, 'string')) {
            //     where.id = queryContent.id;
            // }
            
            Stakeholder.findOne({
                where: where,
                // attributes: attributes
            }).then(result=>{
                "use strict";
                if(result){
                    return callback(null, null, 200, null, result);
                }else{
                    return callback(3, 'find_one_stakeholder_fail', 404, "User haven't created stakeholder before", null);
                }
            }).catch(function(error) {
                "use strict";
                return callback(3, 'find_one_stakeholder_fail', 400, error, null);
            });
        }catch(error){
            return callback(3, 'find_one_stakeholder_fail', 400, error, null);
        }
    },

    getStatistic: function(accessUserId, accessUserType, callback) {
        try {
            let final = {};
            final = {activated: 0,  deleted: 0, total: 0};
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(null, null, 200, null, final);
            }

            Stakeholder.count({
                where:{},
            }).then(function(total){
                "use strict";
                final.total = total;
                Stakeholder.count({
                    where:{status: 1},
                }).then(function(status){
                    final.activated = status;
                    Stakeholder.count({
                        where:{status: 0},
                    }).then(function(status1) {
                        final.deleted = status1;
                        return callback(null, null, 200, null, final);
                    }).catch(function(error) {
                        "use strict";
                        return callback(3, 'count_stakeholder_fail', 400, error, null);
                    });
                }).catch(function(error){
                    "use strict";
                    return callback(3, 'count_stakeholder_fail', 400, error, null);
                });
            }).catch(function(error){
                "use strict";
                return callback(3, 'count_stakeholder_fail', 400, error, null);
            });
        }catch(error){
            return callback(1, 'statistic_stakeholder_fail', 400, error, null);
        }
    },

    getAll: function(accessUserId, accessUserType, queryContent, callback) {
        try {
            let where = {}; 
            let con1 = {};
            let page = 1;
            let perPage = Constant.DEFAULT_PAGING_SIZE;
            let sort = [];
            let attributes = [];

            if(accessUserType < Constant.USER_TYPE.MODERATOR) {
                where.createdBy = accessUserId;
            }

            this.parseFilter(accessUserId, accessUserType, where, queryContent.filter);
            if( Pieces.VariableBaseTypeChecking(queryContent.type, 'string') ){
                where.type = queryContent.type;
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.name, 'string') ){
                where.name = {[Sequelize.Op.like]: queryContent.name};
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.taxcode, 'string') ){
                where.taxcode = queryContent.taxcode;
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
            Stakeholder.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort
            }).then((data) => {
                let pages = Math.ceil(data.count / perPage);
                let stakeholder = data.rows;
                let output = {
                    data: stakeholder,
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
                return callback(3, 'find_and_count_all_stakeholder_fail', 420, error, null);
            });
        } catch(error) {
            return callback(3, 'get_all_stakeholder_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserType, stakeholderId, updateData, callback) {
        try {
            if(( accessUserType === 2 && data.type === 1) 
            || (accessUserType === 1 && data.type === 2)) {
            return callback(3, 'invalid_stakeholder_rights', 400, 'you do not have user rights to do this process', null);    
            }

            let queryObj = {};
            let where = {};

            if ( !( Pieces.VariableBaseTypeChecking(stakeholderId,'string')
                    && Validator.isInt(stakeholderId) )
                && !Pieces.VariableBaseTypeChecking(stakeholderId,'number') ){
                return callback(3, 'invalid_stakeholder_id', 400, 'stakeholder id is incorrect', null);
            }

            if (accessUserType < Constant.USER_TYPE.MODERATOR){
                where.createdBy = accessUserId;
                where.status = { [Sequelize.Op.ne]: Constant.STATUS.NO };
            }

            if ( updateData.status === Constant.STATUS.YES || updateData.status === Constant.STATUS.NO ) {
                queryObj.status = updateData.status;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.name,'string')
                || Validator.isLength(updateData.name, {min: 4, max: 128}) ) {
                    queryObj.name = updateData.name;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.taxcode,'string')
                    || Validator.isLength(updateData.taxcode, {min: 10, max: 20}) ) {
                        queryObj.taxcode = updateData.taxcode;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.district, 'string') ) {
                queryObj.district = updateData.district;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.address, 'string') ) {
                queryObj.detailAddress = updateData.detailAddress;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.phone,'string')
                || Validator.isLength(updateData.phone, {min: 10, max: 20}) ) {
                    queryObj.phone = updateData.phone;
            }

            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now());
            where.id = stakeholderId;

            Stakeholder.update(
                queryObj,
                {where: where}).then(result=>{
                    "use strict";
                    if( (result !== null) && (result.length > 0) && (result[0] > 0) ){
                        return callback(null, null, 200, null, stakeholderId);
                    }else{
                        return callback(3, 'update_stakeholder_fail', 400, '', null);
                    }
            }).catch(function(error){
                "use strict";
                return callback(3, 'update_stakeholder_fail', 420, error, null);
            });
        }catch(error){
            return callback(3, 'update_stakeholder_fail', 400, error, null);
        }
    },

    deletes: function (accessUserId, accessUserType, ids, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(ids,'string')
                    || !Validator.isJSON(ids) ) {
                return callback(3, 'invalid_stakeholder_ids', 400, 'stakeholder id list is not a json array string');
            }
            if(accessUserType < Constant.USER_TYPE.MODERATOR){
                return callback(3, 'invalid_user_right', 403, null);
            }

            let idLists = Pieces.safelyParseJSON(ids);

            let where = {id: {[Sequelize.Op.in]: idLists}};

            let queryObj = {status: Constant.STATUS.NO};

            Stakeholder.update(queryObj, {where: where}).then(result=>{
                "use strict";
                if ( result && (result.length > 0) && result[0] > 0 ) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(3, 'invalid_stakeholder_request', 404, null);
                }
            }).catch(function(error){
                "use strict";
                return callback(3, 'update_stakeholder_fail', 420, error);
            });
        }catch(error){
            return callback(3, 'deletes_stakeholder_fail', 400, error);
        }
    },

    delete: function(accessUserId, accessUserType, id, callback) {
        try {
            let queryObj = {};
            let where = {};

            if(( accessUserType === 2 && data.type === 1) 
                || (accessUserType === 1 && data.type === 2)) {
                return callback(3, 'invalid_stakeholder_rights', 400, 'you do not have user rights to do this process', null);    
            }

            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(3, 'invalid_stakeholder_id', 400, 'stakeholder id is incorrect', null);
            }

            where = { id: id };
            queryObj = { status: Constant.STATUS.NO };

            Stakeholder.findOne({where:where}).then(stakeholder=>{
                "use strict";
                if ( stakeholder && stakeholder.status === Constant.STATUS.NO ){
                    Stakeholder.destroy({where: where}).then(result => {
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        return callback(3, 'remove_stakeholder_fail', 420, error);
                    });
                }else {
                    Stakeholder.update(queryObj, {where: where}).then(result=>{
                        "use strict";
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        return callback(3, 'update_stakeholder_fail', 420, error);
                    })
                }
            }).catch(function(error){
                "use strict";
                return callback(3, 'find_one_stakeholder_fail', 400, error, null);
            });
        }catch(error){
            return callback(3, 'delete_stakeholder_fail', 400, error);
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


