const AttendanceCtrl = require('../controllers/AttendanceCtrl');

module.exports = function(app) {
    /**
     * @api {GET} /v1/auth/attendances/meeting/:id Get Meeting Stakeholder Attend
     * @apiVersion 1.0.0
     * @apiName getMeetingStakeholderAttend
     * @apiGroup Attendances
     * @apiPermission administrator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get Meeting Stakeholder Attend
     *
     * @apiParam {string} id ID of Stakeholder, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/attendances/meeting/2
     *
     * @apiSuccess {String} id the ID of group
     * 
     * @apiParam {string} sid stakeholder's id     
     * @apiParam {string} mid meeting's id
     * @apiParam {string} title title of meeting
     * @apiParam {string} description meeting's description
     * @apiParam {string} begin begin date
     * @apiParam {String} end end date
     * @apiParam {String} status    1: waiting for accept
     *                      <br/>   2: accepted
     *                      <br/>   3: rejected
     * @apiParam {String} category_id category's id
     * @apiParam {String} mainsubject category's name
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "data": [
                        {
                            "sid": 3,
                            "mid": 1,
                            "status": 2,
                            "meeting": {
                                "title": "Sản phẩm công nghệ tương lai",
                                "description": "Giới thiệu",
                                "begin": "2020-12-20T10:00:00.000Z",
                                "end": null,
                                "category": {
                                    "id": 1,
                                    "mainsubject": "Hóa học"
                                }
                            }
                        },
                        {
                            "sid": 3,
                            "mid": 2,
                            "status": 1,
                            "meeting": {
                                "title": "Sinh hóa học",
                                "description": "Giới thiệu",
                                "begin": "2020-12-20T09:00:00.000Z",
                                "end": null,
                                "category": {
                                    "id": 2,
                                    "mainsubject": "Sinh học"
                                }
                            }
                        }
                    ],
                    "pages": {
                        "current": 1,
                        "prev": 0,
                        "hasPrev": false,
                        "next": 0,
                        "hasNext": false,
                        "total": 1
                    },
                    "items": {
                        "begin": 1,
                        "end": 25,
                        "total": 2
                    }
                },
                "message": "",
                "result": "ok"
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "message": "invalid input"
     *     }
     */
    app.get('/v1/auth/attendances/meeting/:id', AttendanceCtrl.getMeetingStakeholderAttend);
    /**
     * @api {GET} /v1/auth/attendances/stakeholder/:id Get Stakeholder Attend that meeting
     * @apiVersion 1.0.0
     * @apiName getStakeholderAttendMeeting
     * @apiGroup Attendances
     * @apiPermission administrator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get Stakeholder Attend Meeting
     *
     * @apiParam {string} id ID of Meeting, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/attendances/stakeholder/2
     *
     * @apiParam {string} sid stakeholder's id     
     * @apiParam {string} mid meeting's id
     * @apiSuccess {String} name name of stakeholder
     * @apiSuccess {String} taxcode taxcode of stakeholder
     * @apiSuccess {String} address address of stakeholder
     * @apiSuccess {String} type type of stakeholder
     * @apiSuccess {String} phone phone of stakeholder
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "data": [
                        {
                            "sid": 3,
                            "mid": 1,
                            "status": 2,
                            "stakeholder": {
                                "name": "Lab 1",
                                "taxcode": "0121213",
                                "address": "Phú Nhuận",
                                "phone": "23123123123123",
                                "type": 2
                            }
                        },
                        {
                            "sid": 1,
                            "mid": 1,
                            "status": 1,
                            "stakeholder": {
                                "name": "Cty Nam Phương",
                                "taxcode": "123455678",
                                "address": "Bình Thạnh",
                                "phone": "0123456789",
                                "type": 1
                            }
                        },
                        {
                            "sid": 6,
                            "mid": 1,
                            "status": 0,
                            "stakeholder": {
                                "name": "Cty TNHH Bình Minh",
                                "taxcode": "232313123321",
                                "address": "Quận 3",
                                "phone": "32312312312",
                                "type": 1
                            }
                        }
                    ],
     *          "result": "ok",
     *          "message" ""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "message": "invalid input"
     *     }
     */
    app.get('/v1/auth/attendances/stakeholder/:id', AttendanceCtrl.getStakeholderAttendMeeting);
    /**
     * @api {PUT} /v1/auth/attendances Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup Attendances
     * @apiPermission administrator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update attendances status
     *
     * @apiParam {String} mid ID of meeting
     * @apiParam {String} sid ID of stakeholder
     * @apiParam {String} status  1: register
     *                      <br/> 2: attented
     *                      <br/> 3: rejected
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/attendances
     *
     * @apiSuccess {String} id the ID of updated user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "mid: 33 sid: 16"
     *          },
     *          "result":"ok",
     *          "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result":"fail",
     *       "message": "invalid input"
     *     }
     */
    app.put('/v1/auth/attendances', AttendanceCtrl.update);
    /**
     * @api {PUT} /v1/auth/attendances/:id Accept Company attend Metting
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup Attendances
     * @apiPermission administrator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update attendances status
     *
     * @apiParam {String} mid ID of meeting, on params
     * @apiParam {String} ids list ID of stakeholder
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/attendances/33
     *
     * @apiSuccess {String} id the ID of updated user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "mid: 33 sid: 16"
     *          },
     *          "result":"ok",
     *          "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result":"fail",
     *       "message": "invalid input"
     *     }
     */
    app.put('/v1/auth/attendances/:id', AttendanceCtrl.updates);

    /**
     * @api {POST} /v1/auth/attendances Create One
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup Attendances
     * @apiPermission just administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create attendances by admin or moderator
     *
     * @apiParam {String} mid ID of meeting
     * @apiParam {String} sid ID of stakeholder
     * @apiParam {String} [status]       1: register
                                   <br/> 2: attented
                                   <br/> 3: rejected
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/attendances
     *
     * @apiSuccess {String} id the ID of created user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data":{
     *       },
     *       "result": "ok",
     *       "message": "",
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "message": "",
     *     }
     */
    app.post('/v1/auth/attendances', AttendanceCtrl.create);

}