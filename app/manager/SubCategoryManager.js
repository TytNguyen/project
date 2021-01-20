const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const SubCategory = require('../models/SubCategory');
const moment = require('moment');

module.exports = {
    create: function (accessUserId, accessUserType, data, callback) {
        try {
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(4, 'invalid_user_id', 400, 'You have no rights to do this action', null);
            }

            let queryObj = {};
            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.createdAt = moment(Date.now());
            queryObj.updatedAt = moment(Date.now());

            queryObj.subject = data.subject;
            queryObj.categoryid = data.categoryid;
            queryObj.status = Constant.STATUS.YES;

            SubCategory.create(queryObj).then(subject => {
                "use strict";
                return callback(null, null, 200, null, subject);
            }).catch(function (error) {
                "use strict";
                return callback(3, 'create_subject_fail', 400, error, null);
            });
        } catch (error) {
            return callback(3, 'create_subject_fail', 400, error, null);
        }
    },

    creates: function (accessUserId, accessUserType, data, callback) {
        try {
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(4, 'invalid_user_id', 400, 'You have no rights to do this action', null);
            }

            let idLists = Pieces.safelyParseJSON(data.ids);
            let match = [];
            for (let value of idLists) {
                match.push([value])
            }

            const convertedData = match.map(arrObj => {
                return {
                    subject: arrObj[0],
                    categoryid: data.categoryid,
                    status: Constant.STATUS.YES,
                    createdBy: accessUserId,
                    updatedBy: accessUserId,
                    createdAt: moment(Date.now()),
                    updatedAt: moment(Date.now()),
                }
            })

            SubCategory.bulkCreate(convertedData).then(subject => {
                "use strict";
                return callback(null, null, 200, null, subject);
            }).catch(function (error) {
                "use strict";
                return callback(3, 'create_subject_fail', 400, error, null);
            });
        } catch (error) {
            return callback(3, 'create_subject_fail', 400, error, null);
        }
    },

    getStatistic: function (accessUserId, accessUserType, callback) {
        try {
            let final = {};
            final = { activated: 0, deleted: 0, total: 0 };
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(null, null, 200, null, final);
            }

            SubCategory.count({
                where: {},
            }).then(function (total) {
                "use strict";
                final.total = total;
                SubCategory.count({
                    where: { status: 1 },
                }).then(function (status) {
                    final.activated = status;
                    SubCategory.count({
                        where: { status: 0 },
                    }).then(function (status1) {
                        final.deleted = status1;
                        return callback(null, null, 200, null, final);
                    }).catch(function (error) {
                        "use strict";
                        return callback(4, 'count_subject_fail', 400, error, null);
                    });
                }).catch(function (error) {
                    "use strict";
                    return callback(4, 'count_subject_fail', 400, error, null);
                });
            }).catch(function (error) {
                "use strict";
                return callback(4, 'count_subject_fail', 400, error, null);
            });
        } catch (error) {
            return callback(4, 'statistic_subject_fail', 400, error, null);
        }
    },

    update: function (accessUserId, accessUserType, categoryId, updateData, callback) {
        try {
            let queryObj = {};
            let where = {};

            if (!(Pieces.VariableBaseTypeChecking(categoryId, 'string')
                && Validator.isInt(categoryId))
                && !Pieces.VariableBaseTypeChecking(categoryId, 'number')) {
                return callback(3, 'invalid_subject_id', 400, 'subject id is incorrect', null);
            }

            if (updateData.status === Constant.STATUS.YES || updateData.status === Constant.STATUS.NO) {
                queryObj.status = updateData.status;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.subject, 'string')) {
                queryObj.subject = updateData.subject;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.categoryid, 'string')) {
                queryObj.categoryid = updateData.categoryid;
            }

            if (Pieces.VariableBaseTypeChecking(updateData.status, 'string')) {
                queryObj.status = updateData.status;
            }

            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now());
            where.id = categoryId;

            SubCategory.update(
                queryObj,
                { where: where }).then(result => {
                    "use strict";
                    if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                        return callback(null, null, 200, null, categoryId);
                    } else {
                        return callback(3, 'update_subject_fail', 400, '', null);
                    }
                }).catch(function (error) {
                    "use strict";
                    return callback(3, 'update_subject_fail', 420, error, null);
                });
        } catch (error) {
            return callback(3, 'update_subject_fail', 400, error, null);
        }
    },

    deletes: function (accessUserId, accessUserType, ids, callback) {
        try {
            if (!Pieces.VariableBaseTypeChecking(ids, 'string')
                || !Validator.isJSON(ids)) {
                return callback(3, 'invalid_subject_ids', 400, 'subject id list is not a json array string');
            }

            let idLists = Pieces.safelyParseJSON(ids);

            let where = { id: { [Sequelize.Op.in]: idLists } };

            let queryObj = { status: Constant.STATUS.NO };

            SubCategory.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result && (result.length > 0) && result[0] > 0) {
                    return callback(null, null, 200, null);
                } else {
                    return callback(3, 'invalid_subject_request', 404, null);
                }
            }).catch(function (error) {
                "use strict";
                return callback(3, 'update_subject_fail', 420, error);
            });
        } catch (error) {
            return callback(3, 'deletes_subject_fail', 400, error);
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
                return callback(3, 'invalid_subject_id', 400, 'subject id is incorrect', null);
            }

            where = { id: id };
            queryObj = { status: Constant.STATUS.NO };

            SubCategory.findOne({ where: where }).then(category => {
                "use strict";
                if (category && category.status === Constant.STATUS.NO) {
                    SubCategory.destroy({ where: where }).then(result => {
                        return callback(null, null, 200, null, result);
                    }).catch(function (error) {
                        return callback(3, 'remove_subject_fail', 420, error);
                    });
                } else {
                    SubCategory.update(queryObj, { where: where }).then(result => {
                        "use strict";
                        return callback(null, null, 200, null, result);
                    }).catch(function (error) {
                        return callback(3, 'update_subject_fail', 420, error);
                    })
                }
            }).catch(function (error) {
                "use strict";
                return callback(3, 'find_one_subject_fail', 400, error, null);
            });
        } catch (error) {
            return callback(3, 'delete_subject_fail', 400, error);
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