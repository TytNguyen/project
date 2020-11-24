/**
 * Created by bioz on 1/13/2017.
 */
// third party components
const BCrypt = require('bcryptjs');
const Validator = require('validator');
const Sequelize = require('sequelize');
const Rest = require('../utils/Restware');

// our components
const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');
const sendGrid = require('../config/SendMail');

const Models = require('../models');
const User = Models.User;
const moment = require('moment');

const cloudinary = require('../middlewares/Cloudinary');

module.exports = {
    // test:  function(data, file, callback) {
    //     let image
    //     cloudinary.uploadSingle(file.path, 'user', result => {
    //         return callback(null, null, 200, null, result);
    //     })
    // },

    getOne: function(accessUserId, accessUserType, id, callback) {
        try {
            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(1, 'invalid_user_id', 400, 'user id is incorrect', null);
            }

            if ( (accessUserId !== id) && (accessUserType < Constant.USER_TYPE.MODERATOR) ) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            let where = {};
            let attributes = ['id', 'phone','email', 'displayName', 'type', 'status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            if(accessUserId !== parseInt(id)) {
                where = {id: id, type: { [Sequelize.Op.lt]: accessUserType} };
            }else{
                where = {id: id};
            }

            User.findOne({
                where: where,
                attributes: attributes,
            }).then(result=>{
                "use strict";
                if(result){
                    return callback(null, null, 200, null, result);
                }else{
                    return callback(1, 'invalid_account', 403, null, null);
                }
            });
        }catch(error){
            return callback(1, 'get_one_account_fail', 400, error, null);
        }
    },

    getStatistic: function(accessUserId, accessUserType, callback) {
        try {
            let final = {};
            final = {activated: 0, deleted: 0, total: 0};
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(null, null, 200, null, final);
            }

            User.count({
                where:{},
            }).then(function(total){
                "use strict";
                final.total = total;
                User.count({
                    where:{status: 1},
                }).then(function(status){
                    final.activated = status;
                    User.count({
                        where:{status: 0},
                    }).then(function(status1) {
                        final.deleted = status1;
                        return callback(null, null, 200, null, final);
                    }).catch(function(error) {
                        "use strict";
                        return callback(1, 'count_user_fail', 400, error, null);
                    });
                }).catch(function(error){
                    "use strict";
                    return callback(1, 'count_user_fail', 400, error, null);
                });
            }).catch(function(error){
                "use strict";
                return callback(1, 'count_user_fail', 400, error, null);
            });
        }catch(error){
            return callback(1, 'statistic_user_fail', 400, error, null);
        }
    },

    getAll: function(accessUserId, accessUserType, query, callback){
        try {
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(1, 'invalid_user_type', 400, null, null);
            }

            let where;
            let cond1 = {};
            let page = 1;
            let perPage = Constant.DEFAULT_PAGING_SIZE;
            let sort = [];
            let attributes = [];

            cond1.type = {[Sequelize.Op.lt]: accessUserType};

            this.parseFilter(accessUserId, accessUserType, cond1, query.filter);
            if( Pieces.VariableBaseTypeChecking(query.q, 'string') ){
                cond1.email = {[Sequelize.Op.like]: query.q};
            }

            where = {[Sequelize.Op.or]:[{id: accessUserId}, cond1] };

            if( (Pieces.VariableBaseTypeChecking(query['page'], 'string') && Validator.isInt(query['page']))
                || (Pieces.VariableBaseTypeChecking(query['page'], 'number')) ){
                page = parseInt(query['page']);
                if(page === 0){
                    page = 1;
                }
            }

            if( (Pieces.VariableBaseTypeChecking(query['perPage'], 'string') && Validator.isInt(query['perPage']))
                || (Pieces.VariableBaseTypeChecking(query['perPage'], 'number')) ){
                perPage = parseInt(query['perPage']);
                if(perPage <= 0){
                    perPage = Constant.DEFAULT_PAGING_SIZE;
                }
            }

            Pieces.splitAndAssignValueForSort(sort, query['sort']);
            if(sort.length <= 0){
                sort.push(['updatedAt', 'DESC']);
            }

            let offset = perPage * (page - 1);
            User.findAndCountAll({
                    where: where,
                    limit: perPage,
                    offset: offset,
                    order: sort
                })
                .then((data) => {

                    let pages = Math.ceil(data.count / perPage);
                    let accounts = data.rows;
                    let output = {
                        data: accounts,
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
                }).catch(function (error) {
                    return callback(1, 'find_and_count_all_user_fail', 420, error, null);
                });
        }catch(error){
            return callback(1, 'get_all_user_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserType, userId, updateData, file, callback) {
        try {
            let queryObj = {};
            let where = {};

            if ( !( Pieces.VariableBaseTypeChecking(userId,'string')
                    && Validator.isInt(userId) )
                && !Pieces.VariableBaseTypeChecking(userId,'number') ){
                return callback(1, 'invalid_user_id', 400, 'user id is incorrect', null);
            }

            if ( accessUserId !== parseInt(userId) && accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(1, 'invalid_user_right', 403, null, null);
            }

            queryObj.updatedBy = accessUserId;

            where.id = userId;

            if (accessUserId === parseInt(userId)){
                where.status = Constant.STATUS.YES;
            }else{
                if(Pieces.ValidObjectEnum(updateData.status, Constant.STATUS)){
                    queryObj.status = updateData.status;
                }

                if(Pieces.ValidObjectEnum(parseInt(updateData.type), Constant.USER_TYPE)){
                    queryObj.type = updateData.type;
                }
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.password, 'string')
                    && Validator.isLength(updateData.password, {min: 4, max: 64}) ) {
                queryObj.password = BCrypt.hashSync(updateData.password, 10);
            }

            queryObj.firstName = updateData.firstName;
            queryObj.lastName = updateData.lastName;

            if (Pieces.VariableBaseTypeChecking(updateData.displayName, 'string')) {
                queryObj.displayName = updateData.displayName;
            } else if (updateData.firstName === undefined && updateData.lastName === undefined) {
                queryObj.displayName = null;
            } else if (updateData.firstName === undefined) {
                queryObj.displayName = updateData.lastName;
            } else if (updateData.lastName === undefined) {
                queryObj.displayName = updateData.firstName;
            } else {
                queryObj.displayName = updateData.firstName + " " + updateData.lastName;
            }
            
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");

            if (file === undefined) {
                User.update(
                    queryObj,
                    {where: where}).then(result=>{
                        "use strict";
                        if( (result !== null) && (result.length > 0) && (result[0] > 0) ){
                            return callback(null, null, 200, null, userId);
                        }else{
                            return callback(1, 'update_user_fail', 400, '', null);
                        }
                }).catch(function(error){
                    "use strict";
                    return callback(1, 'update_user_fail', 420, error, null);
                });
            } else {
                cloudinary.uploadSingle(file.path, 'user', result => {
                    queryObj.image = result;

                    User.update(
                        queryObj,
                        {where: where}).then(result=>{
                            "use strict";
                            if( (result !== null) && (result.length > 0) && (result[0] > 0) ){
                                return callback(null, null, 200, null, userId);
                            }else{
                                return callback(1, 'update_user_fail', 400, '', null);
                            }
                    }).catch(function(error){
                        "use strict";
                        return callback(1, 'update_user_fail', 420, error, null);
                    });
                })
            }
        }catch(error){
            return callback(1, 'update_user_fail', 400, error, null);
        }
    },


    delete: function(accessUserId, accessUserType, id, callback) {
        try {
            let queryObj = {};
            let where = {};

            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(1, 'invalid_user_id', 400, 'user id is incorrect', null);
            }

            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(1, 'invalid_user_right', 403, null);
            }

            where = { id: id, type:{[Sequelize.Op.lt]: accessUserType} };
            queryObj = { status: Constant.STATUS.NO };

            User.findOne({where:where}).then(account=>{
                "use strict";
                if ( account && account.status === Constant.STATUS.NO ){
                    User.destroy({where: where}).then(result => {
                        return callback(null, null, 200, null);
                    }).catch(function(error){
                        return callback(1, 'remove_account_fail', 420, error);
                    });
                }else {
                    User.update(queryObj, {where: where}).then(result=>{
                        "use strict";
                        return callback(null, null, 200, null);
                    }).catch(function(error){
                        return callback(1, 'update_account_fail', 420, error);
                    })
                }
            }).catch(function(error){
                "use strict";
                return callback(1, 'find_one_account_fail', 400, error, null);
            });
        }catch(error){
            return callback(1, 'delete_account_fail', 400, error);
        }
    },

    deletes: function (accessUserId, accessUserType, ids, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(ids,'string')
                    || !Validator.isJSON(ids) ) {
                return callback(1, 'invalid_user_ids', 400, 'user id list is not a json array string');
            }
            if(accessUserType < Constant.USER_TYPE.MODERATOR){
                return callback(1, 'invalid_user_right', 403, null);
            }

            let idLists = Pieces.safelyParseJSON(ids);
            console.log(idLists);

            let where = {id: {[Sequelize.Op.in]: idLists}, type: {[Sequelize.Op.lt]: accessUserType}};

            let queryObj = {status: Constant.STATUS.NO};

            User.update(queryObj, {where: where}).then(result=>{
                "use strict";
                if ( result && (result.length > 0) && result[0] > 0 ) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(1, 'invalid_user_request', 404, null);
                }
            }).catch(function(error){
                "use strict";
                return callback(1, 'update_user_fail', 420, error);
            });
        }catch(error){
            return callback(1, 'deletes_user_fail', 400, error);
        }
    },

    verifyUser: function (accessUserId, accessUserType, accessLoginName, callback) {
        try {
            if ( !( Pieces.VariableBaseTypeChecking(accessUserId,'string')
                    && Validator.isInt(accessUserId) )
                && !Pieces.VariableBaseTypeChecking(accessUserId,'number') ){
                return callback(1, 'invalid_user_id', 400, 'user id is incorrect', null);
            }

            if( !Pieces.VariableBaseTypeChecking(accessUserType,'number') ){
                return callback(1, 'invalid_user_type', 400, 'user type is incorrect', null);
            }

            if( !Pieces.VariableBaseTypeChecking(accessLoginName,'string') ) {
                return callback(1, 'invalid_user_username', 400, 'login name is incorrect', null);
            }

            let where = {id: accessUserId, type:accessUserType, status:Constant.STATUS.YES};
            let attributes = ['id','email', 'phone', 'type', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            User.findOne({
                where: where,
                attributes: attributes
            }).then(result=>{
                "use strict";
                if(result){
                    return callback(null, null, 200, null, result);
                }else{
                    return callback(1, 'invalid_user', 403, null, null);
                }
            }).catch(function(error){
                "use strict";
                return callback(1, 'find_one_user_fail', 400, error, null);
            });
        }catch(error){
            return callback(1, 'find_one_user_fail', 400, error, null);
        }
    },

    authenticate: function (loginName, password, callback) {
        try {
            if (!Pieces.VariableBaseTypeChecking(loginName,'string') ) {
                return callback(1, 'invalid_user_login_name', 422, 'login name is not a string', null);
            }

            if (!Pieces.VariableBaseTypeChecking(password,'string')) {
                return callback(1, 'invalid_user_password', 422, 'password is not a string', null);
            }

            let where = {}

            if (Validator.isEmail(loginName)) 
            {
                where = { email: loginName };
            } else {
                where = { phone: loginName };
            }
            let attributes = ['id', 'phone','password', 'status', 'email', 'type'];

            User.findOne( {
                where: where,
                attributes: attributes}).then( account=>{
                "use strict";
                    if (account) {
                        if(account.status === Constant.STATUS.NO){
                            return callback(1, 'unactivated_user', 404, null, null);
                        }else{
                            BCrypt.compare( password, account.password, function (error, result) {
                                console.log(BCrypt.compare( password, account.password));
                                if (result === true) {
                                    return callback(null, null, 200, null, account);
                                } else {
                                    return callback(1, 'wrong_password', 422, null, null);
                                }
                            });
                        }
                    } else {
                        return callback(1, 'invalid_user', 404, null, null);
                    }
                }).catch(function(error){
                "use strict";
                return callback(1, 'find_one_user_fail', 400, error, null);
            });
        }catch(error){
            return callback(1, 'authenticate_user_fail', 400, error, null);
        }
    },

    createByAdmin: function(accessUserId, accessUserType, userData, file, callback){
        try {
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(1, 'invalid_user_right', 403, 'you must be admin to do this process', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.phone, 'string') ) {
                return callback(1, 'invalid_user_phone', 400,'phone is not a string', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.password, 'string') ) {
                return callback(1, 'invalid_user_password', 400,'password is not a string', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.email, 'string')
                    || !Validator.isEmail(userData.email) ) {
                return callback(1, 'invalid_user_email', 400, 'email is incorrect format', null);
            }

            let queryObj = {};

            queryObj.email = userData.email;
            queryObj.phone = userData.phone;
            queryObj.password = BCrypt.hashSync(userData.password, 10);

            if(userData.status === Constant.STATUS.YES || userData.status === Constant.STATUS.NO){
                queryObj.status = userData.status;
            }else{
                queryObj.status = Constant.STATUS.YES;
            }

            if (Pieces.ValidObjectEnum(parseInt(userData.type), Constant.USER_TYPE)) {
                if(accessUserType <= userData.type){
                    return callback(1, 'invalid_user_right', 403, 'you have no right to do this', null);
                } else {
                    queryObj.type = userData.type;
            }
            }

            queryObj.firstName = userData.firstName;
            queryObj.lastName = userData.lastName;

            if (userData.firstName === undefined && userData.lastName === undefined) {
                queryObj.displayName = null;
            } else if (userData.firstName === undefined) {
                queryObj.displayName = userData.lastName;
            } else {
                queryObj.displayName = userData.firstName + " " + userData.lastName;
            }
            
            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");
            queryObj.createdAt = moment(Date.now()).add(7, "hour");

            if (file === undefined) {
                User.create(queryObj).then(result=>{
                    "use strict";
                    return callback(null, null, 200, null, result);
                }).catch(function(error){
                    "use strict";
                    return callback(1, 'create_user_fail', 420, error, null);
                });
            } else {
                cloudinary.uploadSingle(file.path, 'user', result => {
                    queryObj.image = result;

                    User.create(queryObj).then(result=>{
                        "use strict";
                        return callback(null, null, 200, null, result);
                    }).catch(function(error){
                        "use strict";
                        return callback(1, 'create_user_fail', 420, error, null);
                    });
                })
            }
        }catch(error){
            return callback(1, 'create_by_admin_user_fail', 400, error, null);
        }
    },

    create: function(userData, file, callback){
        try {
            if ( !sendGrid.verify(userData.otp)) {
                return callback(1, 'invalid_otp', 400,'otp is wrong', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.phone, 'string') ) {
                return callback(1, 'invalid_user_phone', 400,'phone is not a string', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.password, 'string') ) {
                return callback(1, 'invalid_user_password', 400,'password is not a string', null);
            }

            if ( !Pieces.VariableBaseTypeChecking(userData.email, 'string')
                    || !Validator.isEmail(userData.email) ) {
                return callback(1, 'invalid_user_email', 400, 'email is incorrect format', null);
            }

            let queryObj = {};

            queryObj.email = userData.email;
            queryObj.phone = userData.phone;
            queryObj.password = BCrypt.hashSync(userData.password, 10);

            if(userData.status === Constant.STATUS.YES || userData.status === Constant.STATUS.NO){
                queryObj.status = userData.status;
            }else{
                queryObj.status = Constant.STATUS.YES;
            }

            if (userData.type > 3) {
                return callback(1, 'wrong_api', 400, 'call wrong api', null);
            } else {
                queryObj.type = userData.type;
            }

            queryObj.firstName = userData.firstName;
            queryObj.lastName = userData.lastName;

            if (userData.firstName === undefined && userData.lastName === undefined) {
                queryObj.displayName = null;
            } else if (userData.firstName === undefined) {
                queryObj.displayName = userData.lastName;
            } else {
                queryObj.displayName = userData.firstName + " " + userData.lastName;
            }
            
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");
            queryObj.createdAt = moment(Date.now()).add(7, "hour");

            if (file === undefined) {
                User.create(queryObj).then(account =>{
                    "use strict";
                    // return callback(null, null, 200, null, result);
                    let query = {};
                    query.createdBy = account.id;
                    query.updatedBy = account.id;
    
                    User.update(
                        query,
                        {where: {id: account.id}}).then(result=>{
                            "use strict";
                            return callback(null, null, 200, null, account);
                    }).catch(function(error){
                        "use strict";
                        return callback(1, 'update_user_fail', 420, error, null);
                    });
    
                }).catch(function(error){
                    "use strict";
                    return callback(1, 'create_user_fail', 420, error, null);
                });
            } else {
                cloudinary.uploadSingle(file.path, 'user', result => {
                    queryObj.image = result;

                    User.create(queryObj).then(account =>{
                        "use strict";
                        // return callback(null, null, 200, null, result);
                        let query = {};
                        query.createdBy = account.id;
                        query.updatedBy = account.id;
        
                        User.update(
                            query,
                            {where: {id: account.id}}).then(result=>{
                                "use strict";
                                return callback(null, null, 200, null, account);
                        }).catch(function(error){
                            "use strict";
                            return callback(1, 'update_user_fail', 420, error, null);
                        });
        
                    }).catch(function(error){
                        "use strict";
                        return callback(1, 'create_user_fail', 420, error, null);
                    });
                })
            }
        }catch(error){
            return callback(1, 'create_user_fail', 400, error, null);
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
