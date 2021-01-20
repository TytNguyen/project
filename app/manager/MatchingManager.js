const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Model = require('../models/index');
const Matching = Model.Matching
const Processes = Model.Processes

const Hashtag = require('../models/Hashtag');
const LabResult = require('../models/LabResult');
const EnterpriseProfile = require('../models/EnterpriseProfile');
const Stakeholder = require('../models/Stakeholder');
const SubCategory = require('../models/SubCategory');
const MatchHashtag = require('../models/MatchHashtag');

const moment = require('moment');

Matching.hasMany(Processes, {foreignKey: 'mid'});
Processes.belongsTo(Matching, {foreignKey: 'mid'});
Matching.belongsTo(LabResult, {foreignKey: 'resultId'});
Matching.belongsTo(EnterpriseProfile, {foreignKey: 'profileId'});
LabResult.belongsToMany(EnterpriseProfile, { through: Matching, foreignKey: 'profileId' });
EnterpriseProfile.belongsToMany(LabResult, { through: Matching, foreignKey: 'resultId' });

Stakeholder.hasMany(EnterpriseProfile, { foreignKey: 'cid' });
EnterpriseProfile.belongsTo(Stakeholder, { foreignKey: 'cid' });
Stakeholder.hasMany(LabResult, {foreignKey: 'lid'});
LabResult.belongsTo(Stakeholder, {foreignKey: 'lid'});

LabResult.belongsTo(SubCategory, {foreignKey: 'subcategory_id'});
SubCategory.hasMany(LabResult, {foreignKey: 'subcategory_id'});

// MatchHashtag.belongsTo(LabResult, {foreignKey: 'result_id'});
// MatchHashtag.belongsTo(Hashtag, {foreignKey: 'hashtag_id'});
// LabResult.belongsToMany(Hashtag, {through: MatchHashtag, foreignKey: 'result_id'});
// Hashtag.belongsToMany(LabResult, {through: MatchHashtag, foreignKey: 'hashtag_id'});

// MatchHashtag.belongsTo(EnterpriseProfile, {foreignKey: 'profile_id'});
// MatchHashtag.belongsTo(Hashtag, {foreignKey: 'hashtag_id'});
// EnterpriseProfile.belongsToMany(Hashtag, {through: MatchHashtag, foreignKey: 'profile_id'});
// Hashtag.belongsToMany(EnterpriseProfile, {through: MatchHashtag, foreignKey: 'hashtag_id'});


module.exports = {
    autoMatching: function(accessUserId, accessUserType, id, sub_id, callback) {
        try {
            let attributes = ['id', 'title','description','status', 'image', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
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
                "use strict";
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
            let attributes = ['id', 'title','description','status', 'image', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
            let product = [];
            let profile = [];

            LabResult.findAll({
                include: [
                    {
                        model: MatchHashtag,
                        attributes: ["hashtag_id"] 
                    }],
                attributes: ["id", "subcategory_id"],
            }).then((lab) => {
                "use strict";
                MatchHashtag.findAll({
                    where: {profile_id: id},
                    attributes: [Sequelize.fn('DISTINCT', Sequelize.col('hashtag_id')), 'hashtag_id'],
                    raw:true,
                }).then(data=>{
                    "use strict";
                    for (var i of data) {
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
                        
                        console.log(ids)

                        LabResult.findAll({
                            where: {id: {[Sequelize.Op.in]: ids}},
                            include: [
                            //     {
                            //     model: Stakeholder,
                            //     attributes: ['id', 'name']
                            // },
                            {
                                model: SubCategory,
                                attributes: ['id', 'subject'],
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
                            order: [Sequelize.literal(("FIELD(labresult.id,"+ids.join(',')+")"))]
                        }).then(result=>{
                            "use strict";
                            if(result){
                                let output = {
                                    data: result,
                                    percent_matching_list: test};
                                return callback(null, null, 200, null, output);
                            }else{
                                return callback(4, 'find_and_count_all_labresult_fail', 404, null, null);
                            }
                        }).catch(function(error) {
                            "use strict";
                            return callback(4, 'find_and_count_all_labresult_fail', 400, error, null);
                        });
                    }
                }).catch(function(error) {
                    console.log(error)
                    return callback(4, 'find_and_count_all_labresult_fail', 400, error, null);
                });
            }).catch(function(error) {
                console.log(error)
                return callback(4, 'find_and_count_all_labresult_fail', 420, error, null);
            });
        }catch(error){
            return callback(4, 'find_and_count_all_labresult_fail', 400, error, null);
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
                include: [
                    {
                    model: EnterpriseProfile,
                    attributes: ['id', 'title'],
                    include: [
                        {
                            model: Stakeholder,
                            attributes: ['id', 'name', 'detailAddress', 'district'],
                        }
                    ]
                },
                {
                    model: LabResult,
                    attributes: ['id', 'title', 'lid'],
                    include: [
                        {
                            model: Stakeholder,
                            attributes: ['id', 'name', 'detailAddress', 'district'],
                        }
                    ]
                },
                {
                    model: Processes, 
                    attributes: ['id', 'step', 'note', 'meetingTime', 'meetingAddress', 'contract', 'createdAt']
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
            final = {activated: 0, canceled: 0, total: 0};
            if ( accessUserType == 1 ) {
                Matching.count({
                    where: {profileId: accessUserId},
                }).then(function(total){
                    "use strict";
                    final.total = total;
                    Matching.count({
                        where:{status: {[Sequelize.Op.notIn]: [9, 10]}, 
                                profileId: accessUserId},
                    }).then(function(status){
                        final.activated = status;
                        Matching.count({
                            where:{status: {[Sequelize.Op.in]: [9, 10]}, 
                                    profileId: accessUserId},
                        }).then(function(status1) {
                            final.canceled = status1;
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
            } else if ( accessUserType == 2 ) {
                Matching.count({
                    where: {resultId: accessUserId},
                }).then(function(total){
                    "use strict";
                    final.total = total;
                    Matching.count({
                        where:{status: {[Sequelize.Op.notIn]: [9, 10]}, 
                                profileId: accessUserId},
                    }).then(function(status){
                        final.activated = status;
                        Matching.count({
                            where:{status: {[Sequelize.Op.in]: [9, 10]}, 
                                    profileId: accessUserId},
                        }).then(function(status1) {
                            final.canceled = status1;
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
            } else {
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
                            final.canceled = status1;
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
            }
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
                where = {profileId: queryContent.profileId};
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.resultId, 'string') ){
                where = {resultId: queryContent.resultId};
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

            console.log(where)
            
            Matching.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort,
                include: [
                    {
                    model: EnterpriseProfile,
                    attributes: ['id', 'title'],
                    include: [
                        {
                            model: Stakeholder,
                            attributes: ['id', 'name', 'detailAddress', 'district'],
                        }
                    ]
                },
                {
                    model: LabResult,
                    attributes: ['id', 'title', 'lid'],
                    include: [
                        {
                            model: Stakeholder,
                            attributes: ['id', 'name', 'detailAddress', 'district'],
                        }
                    ]
                },
                {
                    model: Processes, 
                    attributes: ['id', 'step', 'note', 'meetingTime', 'meetingAddress', 'contract', 'createdAt']
                }],
                distinct:true
                // attributes: attributes,
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

    getRequest: function(accessUserId, accessUserType, queryContent, callback) {
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
            if( Pieces.VariableBaseTypeChecking(queryContent.lid, 'string') ){
                where = {lid: queryContent.lid};
            }

            if( Pieces.VariableBaseTypeChecking(queryContent.cid, 'string') ){
                where = {cid: queryContent.cid};
            }

            console.log(where)

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

            if (where.lid !== undefined) {
                Matching.findAndCountAll({
                limit: perPage,
                offset: offset,
                order: sort,
                include: [
                    {
                    model: EnterpriseProfile,
                    attributes: ['id', 'title'],
                    include: [
                        {
                            model: Stakeholder,
                            attributes: ['id', 'name', 'detailAddress', 'district'],
                        }
                    ]
                },
                {
                    model: LabResult,
                    attributes: ['id', 'title', 'lid'],
                    where: where,
                    include: [
                        {
                            model: Stakeholder,
                            attributes: ['id', 'name', 'detailAddress', 'district'],
                        }
                    ]
                },
                {
                    model: Processes, 
                    attributes: ['id', 'step', 'note', 'createdAt']
                }],
                distinct:true
                // attributes: attributes,
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
            } else {
                Matching.findAndCountAll({
                    limit: perPage,
                    offset: offset,
                    order: sort,
                    include: [
                        {
                        model: EnterpriseProfile,
                        where: where,
                        attributes: ['id', 'title', 'cid'],
                        include: [
                            {
                                model: Stakeholder,
                                attributes: ['id', 'name', 'detailAddress'],
                            }
                        ]
                    },
                    {
                        model: LabResult,
                        attributes: ['id', 'title', 'lid'],
                        include: [
                            {
                                model: Stakeholder,
                                attributes: ['id', 'name', 'detailAddress'],
                            }
                        ]
                    },
                    {
                        model: Processes, 
                        attributes: ['id', 'step', 'note', 'createdAt']
                    }],
                    distinct:true
                    // attributes: attributes,
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
            }
            
            
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
            queryObj.createdAt = moment(Date.now());
            queryObj.updatedAt = moment(Date.now());

            query.createdBy = accessUserId;
            query.updatedBy = accessUserId;
            query.createdAt = moment(Date.now());
            query.updatedAt = moment(Date.now());
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

    update: function (accessUserId, accessUserType, matchingId, updateData, files, callback) {
        try {
            //if ( accessUserType < Constant.USER_TYPE.MODERATOR && (updateData.step !== 2 || updateData.step !== 10) ) {
            //    return callback(1, 'invalid_user_type', 403, null, null);
            //}

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
            queryObj.updatedAt = moment(Date.now());

            where.id = matchingId;
            
            whereProcess.step = updateData.step;
            whereProcess.mid = matchingId;

            if (Pieces.VariableBaseTypeChecking(updateData.meetingTime, 'string')) {
                query.meetingTime = updateData.meetingTime;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.meetingAddress, 'string')) {
                query.meetingAddress = updateData.meetingAddress;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.note, 'string')) {
                query.note = updateData.note;
            }

            query.createdBy = accessUserId;
            query.updatedBy = accessUserId;
            query.createdAt = moment(Date.now());
            query.updatedAt = moment(Date.now());

            query.step = updateData.step;
            query.mid = matchingId;

            if (files !== "") {
                if (files.length > 0) {
                    query.contract = files[0].path;
                 }
            }
                        
            Matching.update(
                queryObj,
                {where: where}).then(matching=>{
                    "use strict";
                    Processes.findOne({where: whereProcess}).then(result=>{
                        "use strict";
                        if ( result && query.step !== 12 ) {
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
                    count = Math.round((count/profile.length) * 10000) / 10000 * 100;
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
