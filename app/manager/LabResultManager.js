const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');
const cloudinary = require('../middlewares/Cloudinary');

const Stakeholder = require('../models/Stakeholder');
const SubCategory = require('../models/SubCategory');
const LabResult = require('../models/LabResult');
const EnterpriseProfile = require('../models/EnterpriseProfile');
const moment = require('moment');
const MatchHashtag = require('../models/MatchHashtag');
const { Hashtag } = require('../models');

Stakeholder.hasMany(LabResult, {foreignKey: 'lid'});
LabResult.belongsTo(Stakeholder, {foreignKey: 'lid'});

LabResult.belongsTo(SubCategory, {foreignKey: 'subcategory_id'});
SubCategory.hasMany(LabResult);

LabResult.belongsToMany(Hashtag, { through: MatchHashtag, foreignKey: 'hashtag_id' });
Hashtag.belongsToMany(LabResult, { through: MatchHashtag, foreignKey: 'result_id' });
MatchHashtag.belongsTo(LabResult, {foreignKey: 'result_id'});
MatchHashtag.belongsTo(Hashtag, {foreignKey: 'hashtag_id'});
LabResult.hasMany(MatchHashtag, {foreignKey: 'result_id'});
Hashtag.hasMany(MatchHashtag, {foreignKey: 'hashtag_id'});

module.exports = {
    uploadFile: function (accessUserId, accessUserType, labresultId, file, callback) {
        try {
            let queryObj = {};
            let where = {};

            if ( !( Pieces.VariableBaseTypeChecking(labresultId,'string')
                    && Validator.isInt(labresultId) )
                && !Pieces.VariableBaseTypeChecking(labresultId,'number') ){
                return callback(3, 'invalid_labresult_id', 400, 'labresult id is incorrect', null);
            }

            queryObj.file = "http://localhost:3000/v1/file/" + file[0].filename;
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now());
            where.id = labresultId;

            LabResult.update(
                queryObj,
                {where: where}).then(result=>{
                    "use strict";
                    return callback(null, null, 200, null, result);
                }).catch(function(error){
                    "use strict";
                    return callback(3, 'update_labresult_fail', 420, error, null);
                });
        }catch(error){
            return callback(3, 'deletes_labresult_fail', 400, error);
        }
    },


    create: function (accessUserId, accessUserType, data, file, callback) {
        try {
            let queryObj = {};

            if ( !Pieces.VariableBaseTypeChecking(data.title,'string')) {
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
            queryObj.createdAt = moment(Date.now());
            queryObj.updatedAt = moment(Date.now());

            queryObj.price = data.price;
            queryObj.lid = data.lid;
            queryObj.subcategory_id = data.subcategory_id;
            queryObj.description = data.description;
            queryObj.status = Constant.STATUS.YES;

            if (file === undefined || file.length == 0) {
                LabResult.create(queryObj).then(labresult => {
                    "use strict";
                    const convertedData = match.map(arrObj => {
                        return {
                            result_id: labresult.id,
                            hashtag_id: arrObj[0],
                            status: 1,
                            createdBy: accessUserId,
                            updatedBy: accessUserId,
                            createdAt: moment(Date.now()),
                            updatedAt: moment(Date.now()),
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
            } else {
                cloudinary.uploadMultiple(file, 'product', result => {
                    let link = '';
                    let path = '';
                    result.forEach((value) => {
                        link += value[0] + ",";
                        path += value[1] + ",";
                    });

                    queryObj.image = link;
                    queryObj.img_location = path;

                    LabResult.create(queryObj).then(labresult => {
                        "use strict";
                        const convertedData = match.map(arrObj => {
                            return {
                                result_id: labresult.id,
                                hashtag_id: arrObj[0],
                                status: 1,
                                createdBy: accessUserId,
                                updatedBy: accessUserId,
                                createdAt: moment(Date.now()),
                                updatedAt: moment(Date.now()),
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
    
                }).catch(function (error) {
                    "use strict";
                    return callback(1, 'create_image_fail', 420, error, null);
                });
            }
            }catch(error) {
                return callback(4, 'create_labresult_fail', 400, error, null);
        }
    },

    getOne: function(accessUserId, accessUserType, id, callback) {
        try {
            let where = {};
            //let attributes = ['id', 'title','description','status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

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
                    // attributes: ['id', 'name']
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
                //attributes: attributes
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
            final = {activated: 0, expired: 0, total: 0};
            if ( accessUserType < Constant.USER_TYPE.MODERATOR ) {
                LabResult.count({
                    where: {createdBy: accessUserId},
                }).then(function(total){
                    "use strict";
                    final.total = total;
                    LabResult.count({
                        where:{status: 1,
                            createdBy: accessUserId},
                    }).then(function(status){
                        final.activated = status;
                        LabResult.count({
                            where:{status: 0,
                                createdBy: accessUserId},
                        }).then(function(status1) {
                            final.expired = status1;
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
            } else {
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
                            final.expired = status1;
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
            }
        }catch(error){
            return callback(4, 'statistic_labresult_fail', 400, error, null);
        }
    },

    getRelate: function (accessUserId, accessUserType, callback) {
        if (accessUserType !== Constant.USER_TYPE.ANONYMOUS) {
            return callback(1, 'invalid_user_type', 403, "Only company can use this api", null);
        }

        try {
            let sub_ids = [];
            EnterpriseProfile.findAll({
                where: {createdBy: {[Sequelize.Op.eq]: accessUserId}},
                attributes: ['subcategory_id'],
                raw:true,
            }).then((data) => {
                if (data.length > 0) {
                    for (var i of data) {
                        sub_ids.push(i.subcategory_id)
                    }
                    LabResult.findAll({
                        where: {subcategory_id: {[Sequelize.Op.in]: sub_ids}},
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
                        distinct:true,
                        order: [ [ 'updatedAt', 'DESC' ]],
                        limit: 3
                    }).then((data) => {
                        if (data.length > 0) {
                            return callback(null, null, 200, null, data);
                        } else {
                            LabResult.findAll({
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
                                distinct:true,
                                order: [ [ 'updatedAt', 'DESC' ]],
                                limit: 3
                            }).then((data) => {
                                return callback(null, null, 200, null, data);
                            }).catch(function (error) {
                                return callback(4, 'find_and_count_all_profile_fail', 420, error, null);
                            });
                        }
                        
                    }).catch(function (error) {
                        return callback(4, 'find_and_count_all_profile_fail', 420, error, null);
                    });
                } else {
                    LabResult.findAll({
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
                        distinct:true,
                        order: [ [ 'updatedAt', 'DESC' ]],
                        limit: 3
                    }).then((data) => {
                        return callback(null, null, 200, null, data);
                    }).catch(function (error) {
                        return callback(4, 'find_and_count_all_profile_fail', 420, error, null);
                    });
                }
            }).catch(function (error) {
                return callback(4, 'find_all_result_fail', 420, error, null);
            });
        } catch (error) {
            return callback(4, 'get_all_profile_fail', 400, error, null);
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
                where.lid = queryContent.lid;
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
                // attributes: attributes,
                distinct:true
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
            let idLists, idList;

            if ( !( Pieces.VariableBaseTypeChecking(labresultId,'string')
                    && Validator.isInt(labresultId) )
                && !Pieces.VariableBaseTypeChecking(labresultId,'number') ){
                return callback(3, 'invalid_labresult_id', 400, 'labresult id is incorrect', null);
            }

            if ( updateData.status === Constant.STATUS.YES || updateData.status === Constant.STATUS.NO ) {
                queryObj.status = updateData.status;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.title,'string')) {
                    queryObj.title = updateData.title;
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.delete_ids,'string')) {
                idLists = Pieces.safelyParseJSON(updateData.delete_ids);
            }

            if ( Pieces.VariableBaseTypeChecking(updateData.ids,'string')) {
                idList = Pieces.safelyParseJSON(updateData.ids);
            } 

            let deletewhere = {result_id: labresultId, hashtag_id: {[Sequelize.Op.in]: idLists}};

            let match = [];
            
            if (idList !== undefined) {
                for (let value of idList) {
                    match.push([value])
                }
            }

            if (Pieces.VariableBaseTypeChecking(updateData.subcategory_id,'string')) {
                queryObj.subcategory_id = updateData.subcategory_id;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.description,'string')) {
                queryObj.description = updateData.description;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.price,'string')) {
                queryObj.price = updateData.price;
            }

            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now());
            where.id = labresultId;

            if(idLists !== undefined) {
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
                                        createdAt: moment(Date.now()),
                                        updatedAt: moment(Date.now()),
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
            } else if (idList !== undefined) {
                const convertedData = match.map(arrObj => {
                    return {
                        result_id: labresultId,
                        hashtag_id: arrObj[0],
                        status: 1,
                        createdBy: accessUserId,
                        updatedBy: accessUserId,
                        createdAt: moment(Date.now()),
                        updatedAt: moment(Date.now()),
                    }
                })

                console.log(convertedData)

                LabResult.update(
                    queryObj,
                    {where: where}).then(result=>{
                        "use strict";
                        MatchHashtag.bulkCreate(convertedData).then(result => {
                            "use strict";
                            return callback(null, null, 200, null, result);
                        }).catch(function(error) {
                        return callback(4, 'create_profile_fail', 400, error, null);
                    });
                        // return callback(null, null, 200, null, result);
                }).catch(function(error){
                    "use strict";
                    return callback(3, 'update_labresult_fail', 420, error, null);
                });
            }
            else {
                LabResult.update(
                    queryObj,
                    {where: where}).then(result=>{
                        "use strict";
                        return callback(null, null, 200, null, result);
                }).catch(function(error){
                    "use strict";
                    return callback(3, 'update_labresult_fail', 420, error, null);
                });
            }
        }catch(error){
            return callback(3, 'updates_labresult_fail', 400, error);
        }
    },

    updateImage: function (accessUserId, accessUserType, resultId, file, delete_ids, callback) {
        try {
            let queryObj = {};
            let where = {};
            let del_ids;

            where.id = resultId;
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now());

            if ( Pieces.VariableBaseTypeChecking(delete_ids,'string')) {
                del_ids = Pieces.safelyParseJSON(delete_ids);
            }

            LabResult.findOne({
                where: where,
                attributes: ["img_location", "image"]
            }).then(result=>{
                "use strict";
                console.log(Pieces.VariableBaseTypeChecking(result.img_location, 'string'))
                if (Pieces.VariableBaseTypeChecking(result.img_location, 'string')) {
                    let paths = result.img_location.replace(/,/g, ' ').split(' ');
                    let location = result.image.replace(/,/g, ' ').split(' ');
                    paths.pop();
                    location.pop()
                    cloudinary.deleteForResult(paths, del_ids, location, values => {
                        let link = '';
                        let path = '';

                        console.log(values)
                        values[0].forEach((val) => {
                            path += val + ",";
                        })

                        values[1].forEach((val) => {
                            link += val + ",";
                        })

                        cloudinary.uploadMultiple(file, 'product', result => {
                            
                            result.forEach((value) => {
                                link += value[0] + ",";
                                path += value[1] + ",";
                            })
                            LabResult.update(
                                {image: link,
                                img_location: path},
                                {where: where}).then(result=>{
                                    "use strict";
                                    return callback(null, null, 200, resultId, null);
                            }).catch(function(error){
                                "use strict";
                                return callback(3, 'update_labresult_fail', 420, error, null);
                            });
                        }).catch(function (error) {
                            "use strict";
                            return callback(1, 'create_image_fail', 420, error, null);
                        });
                    }).catch(function (error) {
                        "use strict";
                        return callback(1, 'delete_image_fail', 420, error, null);
                    });
                } else {
                    cloudinary.uploadMultiple(file, 'product', result => {
                        let link = '';
                        let path = '';
                        result.forEach((value) => {
                            link += value[0] + ",";
                            path += value[1] + ",";
                        })
                        LabResult.update(
                            {image: link,
                            img_location: path},
                            {where: where}).then(result=>{
                                "use strict";
                                return callback(null, null, 200, resultId, null);
                        }).catch(function(error){
                            "use strict";
                            return callback(3, 'update_labresult_fail', 420, error, null);
                        });
        
                    }).catch(function (error) {
                        "use strict";
                        return callback(1, 'create_image_fail', 420, error, null);
                    });
                }
            }).catch(function(error) {
                "use strict";
                return callback(4, 'find_one_labresult_fail', 400, error, null);
            });
        } catch (error) {
            return callback(1, 'update_labresult_fail', 400, error, null);
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

            //if ( (accessUserId !== id) && (accessUserType < Constant.USER_TYPE.MODERATOR) ) {
            //    return callback(1, 'invalid_user_type', 403, null, null);
            //}

            if ( !( Pieces.VariableBaseTypeChecking(id,'string') && Validator.isInt(id) )
                && !Pieces.VariableBaseTypeChecking(id,'number') ){
                return callback(3, 'invalid_labresult_id', 400, 'labresult id is incorrect', null);
            }

            where = { id: id };
            queryObj = { status: Constant.STATUS.NO };

            LabResult.findOne({where:where}).then(labresult =>{
                "use strict";
                if ( labresult && labresult.status === Constant.STATUS.NO ){
                    MatchHashtag.destroy({where: {result_id: id}}).then(result => {
                        LabResult.destroy({where: where}).then(result => {
                            return callback(null, null, 200, null, result);
                        }).catch(function(error){
                            return callback(3, 'remove_labresult_fail', 420, error);
                        });
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
