const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Model = require('../models/index');
const Matching = Model.Matching
const Processes = Model.Processes
const LabResult = Model.LabResult;
const EnterpriseProfile = Model.EnterpriseProfile;
const Stakeholder = Model.Stakeholder;
const SubCategory = Model.SubCategory;
const Hashtag = Model.Hashtag;
const MatchHashtag = Model.MatchHashtag;

const moment = require('moment');

const { resolve } = require('path');
const { isNull } = require('util');

Matching.hasMany(Processes, {foreignKey: 'mid'});
Processes.belongsTo(Matching, {foreignKey: 'mid'});
Matching.belongsTo(LabResult, {foreignKey: 'resultId'});
Matching.belongsTo(EnterpriseProfile, {foreignKey: 'profileId'});
LabResult.belongsToMany(EnterpriseProfile, { through: Matching, foreignKey: 'profileId' });
EnterpriseProfile.belongsToMany(LabResult, { through: Matching, foreignKey: 'resultId' });

// LabResult.belongsTo(Stakeholder, {foreignKey: 'lid'});
// Stakeholder.hasMany(LabResult, {foreignKey: 'lid'});

LabResult.belongsTo(SubCategory, {foreignKey: 'subcategory_id'});
SubCategory.hasMany(LabResult, {foreignKey: 'subcategory_id'});

MatchHashtag.belongsTo(LabResult, {foreignKey: 'result_id'});
MatchHashtag.belongsTo(Hashtag, {foreignKey: 'hashtag_id'});
LabResult.belongsToMany(Hashtag, {through: MatchHashtag, foreignKey: 'result_id'});
Hashtag.belongsToMany(LabResult, {through: MatchHashtag, foreignKey: 'hashtag_id'});

module.exports = {
    autoMatching: function(accessUserId, accessUserType, id, sub_id, callback) {
        try {
            let attributes = ['id', 'title','description','status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
            let product = [];
            let profile = [];

            LabResult.findAll({
                include: [
                    {
                        model: MatchHashtag,
                        attributes: ["hashtag_id"]
                    }],
                attributes: ["id", "subcategory_id"]
            }).then((lab) => {
                MatchHashtag.findAll({
                    where: {profile_id: id},
                    attributes: ['hashtag_id']
                }).then(data=>{
                    "use strict";
                    for (var i of data.values()) {
                        profile.push(i.hashtag_id)
                    }
                    for (var i of lab.values()) {
                        let ids = []
                        for (var j of i.match_hashtags) {
                            ids.push(j.hashtag_id);
                        }
                        product.push([i.id, i.subcategory_id, ids])
                        ids = []
                    }    

                    let test = this.matching(product, profile, sub_id);

                    if (test == null) {
                        return callback(4, 'No_data_suitable_with_your_requirement', 404, "No data suitable with your requirement", null);
                    } else {
                        LabResult.findOne({
                            where: {id: test[0]},
                            include: [
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
                                let output = {
                                    data: result,
                                    percent_matching: test[1]*100}  ;
                                return callback(null, null, 200, null, output);
                            }else{
                                return callback(4, 'find_one_labresult_fail', 404, null, null);
                            }
                        }).catch(function(error) {
                            "use strict";
                            return callback(4, 'find_one_labresult_fail', 400, error, null);
                        });
                    }

                    
                }).catch(function(error) {
                    "use strict";
                    return callback(4, 'find_one_labresult_fail', 400, error, null);
                });
            }).catch(function(error) {
                return callback(4, 'find_and_count_all_labresult_fail', 420, error, null);
            });
        }catch(error){
            return callback(4, 'find_one_matching_fail', 400, error, null);
        }
    },

    recommend: function(accessUserId, accessUserType, id, sub_id, callback) {
        try {
            let attributes = ['id', 'title','description','status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
            let product = [];
            let profile = [];

            LabResult.findAll({
                include: [
                    {
                        model: MatchHashtag,
                        attributes: ["hashtag_id"]
                    }],
                attributes: ["id", "subcategory_id"]
            }).then((lab) => {
                MatchHashtag.findAll({
                    where: {profile_id: id},
                    attributes: [Sequelize.fn('DISTINCT', Sequelize.col('hashtag_id')), 'hashtag_id']
                }).then(data=>{
                    "use strict";
                    for (var i of data.values()) {
                        profile.push(i.hashtag_id)
                    }

                    for (var i of lab.values()) {
                        let ids = []
                        for (var j of i.match_hashtags) {
                            ids.push(j.hashtag_id);
                        }
                        product.push([i.id, i.subcategory_id, ids])
                        ids = []
                    }    

                    let test = this.recommendation(product, profile, sub_id);

                    if(test == null) {
                        return callback(4, 'No_data_suitable_with_your_requirement', 404, "No data suitable with your requirement", null);
                    } else {
                        let ids = []
                        for (var i of test) {
                            ids.push(i[0])
                        }
    
                        LabResult.findAll({
                            where: {id: {[Sequelize.Op.in]: ids}},
                            include: [
                            //     {
                            //     model: Stakeholder,
                            //     attributes: ['id', 'name']
                            // },
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
                            attributes: attributes,
                            order: [Sequelize.literal(("FIELD(LabResult.id,"+ids.join(',')+")"))] 
                        }).then(result=>{
                            "use strict";
                            if(result){
                                let output = {
                                    data: result,
                                    percent_matching_list: test};
                                return callback(null, null, 200, null, output);
                            }else{
                                return callback(4, 'test 1', 404, null, null);
                            }
                        }).catch(function(error) {
                            "use strict";
                            return callback(4, 'test 2', 400, error, null);
                        });
                    }
                }).catch(function(error) {
                    "use strict";
                    console.log(id, sub_id);
                    console.log(error);
                    return callback(4, 'test 3', 400, error, null);
                });
            }).catch(function(error) {
                return callback(4, 'test 4', 420, error, null);
            });
        }catch(error){
            return callback(4, 'test 5', 400, error, null);
        }
    },

    getOne: function(accessUserId, accessUserType, id, callback) {
        try {
            let where = {};
            let attributes = ['id', 'status','type','isCompany', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(4, 'invalid_matching_id', 400, 'matching id is incorrect', null);
            }

            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                where.createdBy = accessUserId;
                where.status = { [Sequelize.Op.ne]: Constant.STATUS.NO };
            }

            where = {id: id};
            
            Matching.findOne({
                where: where,
                include: [{
                    model: EnterpriseProfile,
                    attributes: ['id', 'title']
                },
                {
                    model: LabResult,
                    attributes: ['id', 'title']
                },
                {
                    model: Processes, 
                    attributes: ['id', 'step']
                }],
                attributes: attributes
            }).then(result=>{
                "use strict";
                if(result){
                    return callback(null, null, 200, null, result);
                }else{
                    return callback(4, 'find_one_matching_fail', 404, null, null);
                }
            }).catch(function(error) {
                "use strict";
                return callback(4, 'find_one_matching_fail', 400, error, null);
            });
        }catch(error){
            return callback(4, 'find_one_matching_fail', 400, error, null);
        }
    },

    getStatistic: function(accessUserId, accessUserType, callback) {
        try {
            let final = {};
            final = {activated: 0, deleted: 0, total: 0};
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                return callback(null, null, 200, null, final);
            }

            Matching.count({
                where:{},
            }).then(function(total){
                "use strict";
                final.total = total;
                Matching.count({
                    where:{status: 1},
                }).then(function(status){
                    final.activated = status;
                    Matching.count({
                        where:{status: 0},
                    }).then(function(status1) {
                        final.deleted = status1;
                        return callback(null, null, 200, null, final);
                    }).catch(function(error) {
                        "use strict";
                        return callback(4, 'count_matching_fail', 400, error, null);
                    });
                }).catch(function(error){
                    "use strict";
                    return callback(4, 'count_matching_fail', 400, error, null);
                });
            }).catch(function(error){
                "use strict";
                return callback(4, 'count_matching_fail', 400, error, null);
            });
        }catch(error){
            return callback(4, 'statistic_matching_fail', 400, error, null);
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
            let attributes = ['id', 'status','type','isCompany', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

            this.parseFilter(accessUserId, accessUserType, where, queryContent.filter);
            if( Pieces.VariableBaseTypeChecking(queryContent.profileId, 'string') ){
                where.profileId = queryContent.profileId;
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.resultId, 'string') ){
                where.resultId = queryContent.resultId;
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
            
            Matching.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort,
                include: [
                    {
                    model: EnterpriseProfile,
                    attributes: ['id', 'title']
                },
                {
                    model: LabResult,
                    attributes: ['id', 'title']
                },
                {
                    model: Processes, 
                    attributes: ['id', 'step']
                }],
                // attributes: attributes
            }).then((data) => {
                let pages = Math.ceil(data.count / perPage);
                let matching = data.rows;
                let output = {
                    data: matching,
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
                return callback(4, 'find_and_count_all_matching_fail', 420, error, null);
            });
        } catch(error) {
            return callback(4, 'get_all_matching_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserType, data, callback) {
        try {
            // if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
            //     return callback(4, 'invalid_user_right', 403, 'you must be admin to do this process', null);
            // }

            let queryObj = {};
            let where = {};
            let query = {}

            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.createdAt = moment(Date.now()).add(7, "hour");
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");

            query.createdBy = accessUserId;
            query.updatedBy = accessUserId;
            query.createdAt = moment(Date.now()).add(7, "hour");
            query.updatedAt = moment(Date.now()).add(7, "hour");
            query.step = 1;

            queryObj.profileId = data.profileId;
            queryObj.resultId = data.resultId;
            queryObj.status = Constant.STATUS.YES;
            queryObj.type = data.type;
            queryObj.isCompany = data.isCompany;

            where.profileId = data.profileId;
            where.resultId = data.resultId;

            console.log(data.profileId)

            Matching.findOne({where: where}).then(result=>{
                "use strict";
                if ( result && (result.status !== 9 || result.status !== 10) ) {
                    return callback(4, 'matching_exist', 400, null);
                } else {
                    Matching.create(queryObj).then(matching => {
                        "use strict";
                        query.mid = matching.id;
                        Processes.create(query).then(result =>{
                            "use strict";
                            return callback(null, null, 200, null, matching);
                        }).catch(function(error){
                            "use strict";
                            return callback(4, 'create_matching_fail', 420, error, null);
                        });
                    }).catch(function(error) {
                        "use strict";
                        return callback(4, 'create_matching_fail', 400, error, null);
                    });
                }
            }).catch(function(error) {
                "use strict";
                return callback(4, 'find_one_matching_fail', 400, error, null);
            });
            }catch(error) {
                return callback(4, 'create_matching_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserType, matchingId, updateData, callback) {
        try {
            if ( accessUserType < Constant.USER_TYPE.MODERATOR && (updateData.step !== 2 || updateData.step !== 10) ) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            let queryObj = {};
            let where = {};
            let match;
            let whereProcess = {};
            let query = {}

            if ( !( Pieces.VariableBaseTypeChecking(matchingId,'string')
                    && Validator.isInt(matchingId) )
                && !Pieces.VariableBaseTypeChecking(matchingId,'number') ){
                return callback(4, 'invalid_matching_id', 400, 'matching id is incorrect', null);
            }

            queryObj.status = updateData.step;
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");

            where.id = matchingId;
            
            whereProcess.step = updateData.step;
            whereProcess.mid = matchingId;

            query.createdBy = accessUserId;
            query.updatedBy = accessUserId;
            query.createdAt = moment(Date.now()).add(7, "hour");
            query.updatedAt = moment(Date.now()).add(7, "hour");

            query.step = updateData.step;
            query.mid = matchingId;
            query.note = updateData.note;

            Matching.update(
                queryObj,
                {where: where}).then(matching=>{
                    "use strict";
                    Processes.findOne({where: whereProcess}).then(result=>{
                        "use strict";
                        if ( result ) {
                            return callback(4, 'processes_exist', 400, null);
                        } else {
                            Processes.create(query).then(result1 =>{
                                "use strict";
                                return callback(null, null, 200, null, matching);
                            }).catch(function(error){
                                "use strict";
                                return callback(4, 'create_processes_fail', 420, error, null);
                            });
                        }
                    }).catch(function(error) {
                        "use strict";
                        return callback(4, 'find_one_matching_fail', 400, error, null);
                    });
            }).catch(function(error){
                "use strict";
                return callback(4, 'update_matching_fail', 420, error, null);
            });
        }catch(error){
            return callback(4, 'update_matching_fail', 400, error, null);
        }
    },

    deletes: function (accessUserId, accessUserType, ids, callback) {
        try {
            if ( !Pieces.VariableBaseTypeChecking(ids,'string')
                    || !Validator.isJSON(ids) ) {
                return callback(4, 'invalid_matching_ids', 400, 'matching id list is not a json array string');
            }
            if(accessUserType < Constant.USER_TYPE.MODERATOR){
                return callback(4, 'invalid_user_right', 403, null);
            }

            let idLists = Pieces.safelyParseJSON(ids);

            let where = {id: {[Sequelize.Op.in]: idLists}};

            let queryObj = {status: Constant.STATUS.NO};

            Matching.update(queryObj, {where: where}).then(result=>{
                "use strict";
                if ( result && (result.length > 0) && result[0] > 0 ) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(4, 'invalid_matching_request', 404, null);
                }
            }).catch(function(error){
                "use strict";
                return callback(4, 'update_matching_fail', 420, error);
            });
        }catch(error){
            return callback(4, 'deletes_matching_fail', 400, error);
        }
    },

    matching: function (product, profile, sub_id) {
        let count = 0;
        let largest = 0;
        let largest_id = 0;

        for (var value of product) {
            if (value[1] === sub_id) {
                for (var i of value[2]) {
                    for (var j of profile) {
                        if (i === j) {
                            count ++; 
                        }
                    }
                }
                if (count > largest) {
                    largest = count;
                    largest_id = value[0];
                }
                count = 0;
            } 
        } 

        if (largest === 0) {
            return null;
        } else
            return([largest_id, largest/profile.length]);
    },

    recommendation: function (product, profile, sub_id) {
        let percent = [];
        let count = 0;

        for (var value of product) {
            if (value[1] === sub_id) {
                for (var i of value[2]) {
                    for (var j of profile) {
                        if (i === j) {
                            count ++; 
                        }
                    }
                }

                if (count !== 0) {
                    count = Math.round((count/profile.length) * 10000) / 10000;
                    percent.push([value[0], count]);
                }
                count = 0;
            } 
        } 

        for (var i = percent.length - 1; i > 0; i --) {
            if (percent[i][1] > percent[i - 1][1]) {
                percent.splice(i - 1, 0, percent[i]);
                percent.splice(i + 1, 1);
            }
        }

        if (percent.length == 0) {
            return null;
        } else
            return(percent)        
    },
}