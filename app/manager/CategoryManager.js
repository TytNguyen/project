const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const moment = require('moment');

Category.hasMany(SubCategory, { foreignKey: 'categoryid' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryid' });

module.exports = {
    createCategory: function (accessUserId, accessUserType, data, callback) {
        try {
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(4, 'invalid_category_id', 400, 'category id is incorrect', null);
            }

            let queryObj = {};
            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.createdAt = moment(Date.now());
            queryObj.updatedAt = moment(Date.now());

            queryObj.mainsubject = data.mainsubject;
            queryObj.status = Constant.STATUS.YES;

            Category.create(queryObj).then(category => {
                "use strict";
                return callback(null, null, 200, null, category);
            }).catch(function (error) {
                "use strict";
                return callback(3, 'create_category_fail', 400, error, null);
            });
        } catch (error) {
            return callback(3, 'create_category_fail', 400, error, null);
        }
    },

    getOneCategory: function (accessUserId, accessUserType, id, callback) {
        try {
            let where = {};
            // let attributes = ['id', 'title','description','field', 'begin', 'end', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];


            // if (accessUserType < Constant.USER_TYPE.MODERATOR) {
            //     where.createdBy = accessUserId;
            //     where.status = { [Sequelize.Op.ne]: Constant.STATUS.NO };
            // }

            where = { id: id };

            Category.findAndCountAll({
                where: where,
                include: [{
                    model: SubCategory,
                    attributes: ['id', 'subject']
                }],
                // attributes: attributes
            }).then(result => {
                "use strict";
                if (result) {
                    return callback(null, null, 200, null, result);
                } else {
                    return callback(4, 'find_one_category_fail', 404, null, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(4, 'find_one_category_fail', 400, error, null);
            });
        } catch (error) {
            return callback(4, 'find_one_category_fail', 400, error, null);
        }
    },

    getStatistic: function (accessUserId, accessUserType, callback) {
        try {
            let final = {};
            final = { activated: 0, deleted: 0, total: 0 };
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(null, null, 200, null, final);
            }

            Category.count({
                where: {},
            }).then(function (total) {
                "use strict";
                final.total = total;
                Category.count({
                    where: { status: 1 },
                }).then(function (status) {
                    final.activated = status;
                    Category.count({
                        where: { status: 0 },
                    }).then(function (status1) {
                        final.deleted = status1;
                        return callback(null, null, 200, null, final);
                    }).catch(function (error) {
                        "use strict";
                        return callback(4, 'count_category_fail', 400, error, null);
                    });
                }).catch(function (error) {
                    "use strict";
                    return callback(4, 'count_category_fail', 400, error, null);
                });
            }).catch(function (error) {
                "use strict";
                return callback(4, 'count_category_fail', 400, error, null);
            });
        } catch (error) {
            return callback(4, 'statistic_category_fail', 400, error, null);
        }
    },

    getAll: function (accessUserId, accessUserType, queryContent, callback) {
        try {
            // if (accessUserType < Constant.USER_TYPE.MODERATOR) {
            //     return callback(4, 'invalid_user_type', 400, null, null);
            // }

            let where;
            let con1 = {};
            let page = 1;
            let perPage = Constant.DEFAULT_PAGING_SIZE;
            let sort = [];
            let attributes = [];

            this.parseFilter(accessUserId, accessUserType, where, queryContent.filter);
            // if (Pieces.VariableBaseTypeChecking(queryContent.q, 'string')) {
            //     where.mainsubject = { [Sequelize.Op.like]: queryContent.q };
            // }

            if ((Pieces.VariableBaseTypeChecking(queryContent['page'], 'string') && Validator.isInt(queryContent['page']))
                || (Pieces.VariableBaseTypeChecking(queryContent['page'], 'number'))) {
                page = parseInt(queryContent['page']);
                if (page === 0) {
                    page = 1;
                }
            }

            if ((Pieces.VariableBaseTypeChecking(queryContent['perPage'], 'string') && Validator.isInt(queryContent['perPage']))
                || (Pieces.VariableBaseTypeChecking(queryContent['perPage'], 'number'))) {
                perPage = parseInt(queryContent['perPage']);
                if (perPage <= 0) {
                    perPage = Constant.DEFAULT_PAGING_SIZE;
                }
            }

            Pieces.splitAndAssignValueForSort(sort, queryContent['sort']);
            if (sort.length <= 0) {
                sort.push(['updatedAt', 'DESC']);
            }

            let offset = perPage * (page - 1);
            Category.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort,
                include: [{
                    model: SubCategory,
                    attributes: ['id', 'subject']
                }],
            }).then((data) => {
                let pages = Math.ceil(data.count / perPage);
                let category = data.rows;
                let output = {
                    data: category,
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
                return callback(4, 'find_and_count_all_category_fail', 420, error, null);
            });
        } catch (error) {
            return callback(4, 'get_all_category_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserType, categoryId, updateData, callback) {
        try {
            let queryObj = {};
            let where = {};

            if (!(Pieces.VariableBaseTypeChecking(categoryId, 'string')
                && Validator.isInt(categoryId))
                && !Pieces.VariableBaseTypeChecking(categoryId, 'number')) {
                return callback(3, 'invalid_category_id', 400, 'category id is incorrect', null);
            }

            if (updateData.status === Constant.STATUS.YES || updateData.status === Constant.STATUS.NO) {
                queryObj.status = updateData.status;
            }

            if (updateData.mainsubject !== undefined) {
                queryObj.mainsubject = updateData.mainsubject;
            }

            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now());
            where.id = categoryId;

            Category.update(
                queryObj,
                { where: where }).then(result => {
                    "use strict";
                    if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                        return callback(null, null, 200, null, categoryId);
                    } else {
                        return callback(3, 'update_category_fail', 400, '', null);
                    }
                }).catch(function (error) {
                    "use strict";
                    return callback(3, 'update_category_fail', 420, error, null);
                });
        } catch (error) {
            return callback(3, 'update_category_fail', 400, error, null);
        }
    },

    deletes: function (accessUserId, accessUserType, ids, callback) {
        try {
            if (!Pieces.VariableBaseTypeChecking(ids, 'string')
                || !Validator.isJSON(ids)) {
                return callback(3, 'invalid_category_ids', 400, 'category id list is not a json array string');
            }

            let idLists = Pieces.safelyParseJSON(ids);

            let where = { id: { [Sequelize.Op.in]: idLists } };

            let queryObj = { status: Constant.STATUS.NO };

            Category.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(3, 'invalid_category_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(3, 'update_category_fail', 420, error);
            });
        } catch (error) {
            return callback(3, 'deletes_category_fail', 400, error);
        }
    },

    delete: function (accessUserId, accessUserType, id, callback) {
        try {
            let queryObj = {};
            let where = {};

            if ((accessUserId !== id) && (accessUserType < Constant.USER_TYPE.MODERATOR)) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            if (!(Pieces.VariableBaseTypeChecking(id, 'string') && Validator.isInt(id))
                && !Pieces.VariableBaseTypeChecking(id, 'number')) {
                return callback(3, 'invalid_category_id', 400, 'category id is incorrect', null);
            }

            where = { id: id };
            queryObj = { status: Constant.STATUS.NO };

            Category.findOne({ where: where }).then(category => {
                "use strict";
                if (category && category.status === Constant.STATUS.NO) {
                    Category.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null, result);
                    }).catch(function (error) {
                        return callback(3, 'remove_category_fail', 420, error);
                    });
                } else {
                    Category.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null, result);
                    }).catch(function (error) {
                        return callback(3, 'update_category_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(3, 'find_one_category_fail', 400, error, null);
            });
        } catch (error) {
            return callback(3, 'delete_category_fail', 400, error);
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