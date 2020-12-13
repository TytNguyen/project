const Validator = require('validator');
const Sequelize = require('sequelize');

const Constant = require('../utils/Constant');
const Pieces = require('../utils/Pieces');

const Attendance = require('../models/Attendance');
const Meeting = require('../models/Meeting');
const Stakeholder = require('../models/Stakeholder');
const moment = require('moment');
const Category = require('../models/Category');

Meeting.belongsToMany(Stakeholder, { through: Attendance, foreignKey: 'sid' });
Stakeholder.belongsToMany(Meeting, { through: Attendance, foreignKey: 'mid' });
Attendance.belongsTo(Meeting, { foreignKey: 'mid' });
Attendance.belongsTo(Stakeholder, { foreignKey: 'sid' });
Meeting.belongsTo(Category);
Category.hasMany(Meeting);

module.exports = {
    getMeetingStakeholderAttend: function (accessUserId, accessUserType, stakeholderId, query, callback) {
        try {
            if (!(Pieces.VariableBaseTypeChecking(stakeholderId, 'string') && Validator.isInt(stakeholderId))
                && !Pieces.VariableBaseTypeChecking(stakeholderId, 'number')) {
                return callback(4, 'invalid_stakeholder_id', 400, 'stakeholder id is incorrect', null);
            }

            // if (accessUserType < Constant.USER_TYPE.MODERATOR) {
            //     return callback(1, 'invalid_user_type', 403, null, null);
            // }

            let where;
            let page = 1;
            let perPage = Constant.DEFAULT_PAGING_SIZE;
            let sort = [];
            let attributes = ['status'];

            where = { sid: stakeholderId };

            if ((Pieces.VariableBaseTypeChecking(query['page'], 'string') && Validator.isInt(query['page']))
                || (Pieces.VariableBaseTypeChecking(query['page'], 'number'))) {
                page = parseInt(query['page']);
                if (page === 0) {
                    page = 1;
                }
            }

            if ((Pieces.VariableBaseTypeChecking(query['perPage'], 'string') && Validator.isInt(query['perPage']))
                || (Pieces.VariableBaseTypeChecking(query['perPage'], 'number'))) {
                perPage = parseInt(query['perPage']);
                if (perPage <= 0) {
                    perPage = Constant.DEFAULT_PAGING_SIZE;
                }
            }

            Pieces.splitAndAssignValueForSort(sort, query['sort']);
            if (sort.length <= 0) {
                sort.push(['updatedAt', 'DESC']);
            }

            let offset = perPage * (page - 1);

            Attendance.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort,
                include: [{
                    model: Meeting,
                    attributes: ['id', 'title', 'description', 'begin', 'end'],
                    include: [{
                        model: Category,
                        attributes: ['id', 'mainsubject'],
                    }]
                }],
                attributes: attributes,
            }).then(data => {
                "use strict";
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
            }).catch(function (error) {
                "use strict";
                return callback(4, 'find_meeting_stakeholder_attend_fail', 400, error, null);
            });
        } catch (error) {
            return callback(4, 'find_meeting_stakeholder_attend_fail', 400, error, null);
        }
    },


    getStakeholderAttendMeeting: function (accessUserId, accessUserType, meetingId, query, callback) {
        try {
            if (!(Pieces.VariableBaseTypeChecking(meetingId, 'string') && Validator.isInt(meetingId))
                && !Pieces.VariableBaseTypeChecking(meetingId, 'number')) {
                return callback(4, 'invalid_meeting_id', 400, 'meeting id is incorrect', null);
            }

            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            let where;
            let page = 1;
            let perPage = Constant.DEFAULT_PAGING_SIZE;
            let sort = [];
            let attributes = ['status'];

            if (Pieces.VariableBaseTypeChecking(query.status, 'string')) {
                where.status = query.status;
            }

            where = { mid: meetingId };

            if ((Pieces.VariableBaseTypeChecking(query['page'], 'string') && Validator.isInt(query['page']))
                || (Pieces.VariableBaseTypeChecking(query['page'], 'number'))) {
                page = parseInt(query['page']);
                if (page === 0) {
                    page = 1;
                }
            }

            if ((Pieces.VariableBaseTypeChecking(query['perPage'], 'string') && Validator.isInt(query['perPage']))
                || (Pieces.VariableBaseTypeChecking(query['perPage'], 'number'))) {
                perPage = parseInt(query['perPage']);
                if (perPage <= 0) {
                    perPage = Constant.DEFAULT_PAGING_SIZE;
                }
            }

            Pieces.splitAndAssignValueForSort(sort, query['sort']);
            if (sort.length <= 0) {
                sort.push(['updatedAt', 'DESC']);
            }

            let offset = perPage * (page - 1);

            Attendance.findAndCountAll({
                where: where,
                limit: perPage,
                offset: offset,
                order: sort,
                include: [{
                    model: Stakeholder,
                    attributes: ['id', 'name', 'taxcode', 'district', 'detailAddress', 'phone', 'type']
                }],
                attributes: attributes,
            }).then(data => {
                "use strict";
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
            }).catch(function (error) {
                "use strict";
                return callback(4, 'find_meeting_stakeholder_attend_fail', 400, error, null);
            });
        } catch (error) {
            return callback(4, 'find_stakeholder_attend_meeting_fail', 400, error, null);
        }
    },

    updates: function (accessUserId, accessUserType, meetingId, ids, callback) {
        try {

            console
            if (!Pieces.VariableBaseTypeChecking(ids, 'string')
                || !Validator.isJSON(ids)) {
                return callback(3, 'invalid_attendance_ids', 400, 'attendance id list is not a json array string');
            }

            let idLists = Pieces.safelyParseJSON(ids);

            let where = { mid: meetingId, sid: { [Sequelize.Op.in]: idLists } };

            let queryObj = { status: 2 };

            let where1 = { mid: meetingId, status: 2 };

            Attendance.update(queryObj, { where: where }).then(result => {
                "use strict";
                if (result) {
                    Attendance.count({
                        where: where1
                    }).then(function (total) {
                        "use strict";
                        Meeting.update(
                            { currentAttend: total },
                            { where: { id: meetingId } }).then(result => {
                                "use strict";
                                return callback(null, null, 200, null, meetingId);
                            }).catch(function (error) {
                                "use strict";
                                return callback(4, 'update_attendance_fail', 420, error, null);
                            });
                    }).catch(function (error) {
                        "use strict";
                        return callback(4, 'count_attendance_fail', 420, error, null);
                    });
                }
            }).catch(function (error) {
                "use strict";
                return callback(3, 'update_attendance_fail', 420, error);
            });
        } catch (error) {
            return callback(3, 'deletes_attendance_fail', 400, error);
        }

    },

    update: function (accessUserId, accessUserType, updateData, callback) {
        try {
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(1, 'invalid_user_type', 403, null, null);
            }

            let queryObj = {};
            let where = {};

            if (!(Pieces.VariableBaseTypeChecking(updateData.mid, 'string')
                && Validator.isInt(updateData.mid))
                && Pieces.VariableBaseTypeChecking(updateData.mid, 'number')) {

                if (!(Pieces.VariableBaseTypeChecking(updateData.sid, 'string')
                    && Validator.isInt(updateData.sid))
                    && !Pieces.VariableBaseTypeChecking(updateData.sid, 'number')) {
                    return callback(4, 'invalid_stakeholder_id', 400, 'stakeholder id is incorrect', null);
                }
            } else {
                return callback(4, 'invalid_meeting_id', 400, 'meeting id is incorrect', null);
            }

            if (updateData.status !== undefined) {
                queryObj.status = updateData.status;
            }

            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");

            where.mid = updateData.mid;
            where.sid = updateData.sid;
            let final = { limited: 0, currentAttend: 0 };

            let where1 = { mid: updateData.mid, status: 2 }

            if (queryObj.status == 2) {
                Meeting.findOne({
                    where: updateData.mid,
                }).then(result => {
                    "use strict";
                    final.limited = result.limited;
                    final.currentAttend = result.currentAttend;
                    if (final.limited <= final.currentAttend) {
                        return callback(4, 'full_number_of_attendances', 400, 'number of attendances is full', null);
                    } else {
                        Attendance.update(
                            queryObj,
                            { where: where }).then(result => {
                                "use strict";
                                Attendance.count({
                                    where: where1
                                }).then(function (total) {
                                    "use strict";
                                    final.currentAttend = total;
                                    Meeting.update(
                                        final,
                                        { where: { id: where.mid } }).then(result => {
                                            "use strict";
                                            return callback(null, null, 200, null, "mid: " + updateData.mid + " sid: " + updateData.sid);
                                        }).catch(function (error) {
                                            "use strict";
                                            return callback(4, 'update_meeting_fail', 420, error, null);
                                        });
                                }).catch(function (error) {
                                    "use strict";
                                    return callback(4, 'count_attendance_fail', 420, error, null);
                                });
                            }).catch(function (error) {
                                "use strict";
                                return callback(4, 'update_status_attendance_fail', 420, error, null);
                            });
                    }
                }).catch(function (error) {
                    "use strict";
                    return callback(4, 'find_one_meeting_fail', 400, error, null);
                });
            } else {
                Attendance.update(
                    queryObj,
                    { where: where }).then(result => {
                        "use strict";
                        Attendance.count({
                            where: where1
                        }).then(function (total) {
                            "use strict";
                            final.currentAttend = total;
                            Meeting.update(
                                final,
                                { where: { id: where.mid } }).then(result => {
                                    "use strict";
                                    // return callback(null, null, 200, null, result);
                                }).catch(function (error) {
                                    "use strict";
                                    return callback(4, 'update_meeting_fail', 420, error, null);
                                });
                        }).catch(function (error) {
                            "use strict";
                            return callback(4, 'count_attendance_fail', 420, error, null);
                        });
                        if ((result !== null) && (result.length > 0) && (result[0] > 0)) {
                            return callback(null, null, 200, null, "mid: " + updateData.mid + " sid: " + updateData.sid);
                        } else {
                            return callback(4, 'update_status_attendance_fail', 400, '', null);
                        }
                    }).catch(function (error) {
                        "use strict";
                        return callback(4, 'update_status_attendance_fail', 420, error, null);
                    });
            }
        } catch (error) {
            return callback(4, 'find_one_meeting_fail', 400, error, null);
        }
    },

    create: function (accessUserId, accessUserType, data, callback) {
        try {
            if (accessUserType < Constant.USER_TYPE.MODERATOR) {
                return callback(4, 'invalid_user_right', 403, 'you must be admin to do this process', null);
            }

            if (!(Pieces.VariableBaseTypeChecking(data.mid, 'string')
                && Validator.isInt(data.mid))
                && Pieces.VariableBaseTypeChecking(data.mid, 'number')) {

                if (!(Pieces.VariableBaseTypeChecking(data.sid, 'string')
                    && Validator.isInt(data.sid))
                    && !Pieces.VariableBaseTypeChecking(data.sid, 'number')) {
                    return callback(4, 'invalid_stakeholder_id', 400, 'stakeholder id is incorrect', null);
                }
            } else {
                return callback(4, 'invalid_meeting_id', 400, 'meeting id is incorrect', null);
            }

            let queryObj = {};

            if (Pieces.VariableBaseTypeChecking(data.status, 'string')) {
                queryObj.status = data.status;
            } else {
                queryObj.status = 1;
            }

            queryObj.createdBy = accessUserId;
            queryObj.updatedBy = accessUserId;
            queryObj.updatedAt = moment(Date.now()).add(7, "hour");
            queryObj.createdAt = moment(Date.now()).add(7, "hour");

            queryObj.mid = data.mid;
            queryObj.sid = data.sid;

            Attendance.create(queryObj).then(attendance => {
                "use strict";
                return callback(null, null, 200, null, attendance);
            }).catch(function (error) {
                "use strict";
                return callback(4, 'create_attendance_fail', 400, error, null);
            });
        } catch (error) {
            return callback(4, 'create_attendance_fail', 400, error, null);
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
