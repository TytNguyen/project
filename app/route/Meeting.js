const MeetingCtrl = require('../controllers/MeetingCtrl');

module.exports = function(app) {
    /**
     * @api {GET} /v1/auth/meetings/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne
     * @apiGroup Meetings
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one meetings
     *
     * @apiParam {string} id ID of meetings, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/meetings/2
     *
     * @apiSuccess {String} id the ID of group
     * @apiParam {string} title title of meeting
     * @apiParam {string} description meeting's description
     * @apiParam {string} begin begin date
     * @apiParam {String} end end date
     * @apiParam {String} status  1: actived 
     *                      <br/> 0: expired
     * @apiParam {String} limited maximun number of people attend
     * @apiParam {String} currentAttend number of people have register
     * @apiParam {String} category_id category's id
     * @apiParam {String} mainsubject category's name
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "id": 1,
                    "title": "Sản phẩm công nghệ tương lai",
                    "description": "Giới thiệu",
                    "begin": "2020-12-20T10:00:00.000Z",
                    "end": null,
                    "limited": 11,
                    "currentAttend": 2,
                    "status": 1,
                    "createdAt": "2020-09-17T10:52:33.000Z",
                    "updatedAt": "2020-09-17T10:52:33.000Z",
                    "createdBy": 1,
                    "updatedBy": 1,
                    "category": {
                        "id": 1,
                        "mainsubject": "Hóa học"
                    }
                },
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
    app.get('/v1/auth/meetings/:id', MeetingCtrl.getOne);
    app.get('v1/auth/meetings/statistic', MeetingCtrl.getOne);
    /**
     * @api {GET} /v1/auth/meetings Get List
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup Meetings
     * @apiPermission administrator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all meetings
     *
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {String} q Text filter for data (N/A)
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/meetings
     *
     * @apiSuccess {Object[]} data the list of data
     * @apiSuccess {Object} items {begin, end, total}
     * @apiSuccess {Object} pages {current, prev, hasPrev, next, hasNext, total}
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": [...],
     *       "items": {"begin": 1, "end": 3, "total": 5},
     *       "pages": {"current": 1, "prev": 3, "hasPrev": true, "next": 5, "hasNext": true, "total": 56},
     *       "result": "ok",
     *       "message": ""
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
    app.get('/v1/auth/meetings', MeetingCtrl.getAll);
    /**
     * @api {POST} /v1/auth/meetings Create One
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup Meetings
     * @apiPermission just administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create meetings by admin or moderator
     *
     * @apiParam {string} title title of meeting
     * @apiParam {string} description meeting's description
     * @apiParam {String} category_id category's id
     * @apiParam {string} begin begin date
     * @apiParam {String} end end date
     * @apiParam {String} limited maximun number of people attend
     * @apiParam {String} currentAttend number of people have register
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/meetings
     *
     * @apiSuccess {String} id the ID of created meeting
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data":{
     *           "id": "abc"
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
    app.post('/v1/auth/meetings', MeetingCtrl.create);
    /**
     * @api {PUT} /v1/auth/meetings/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup Meetings
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update meetings information
     *
     * @apiParam {String} id ID of meetings, on params
     * @apiParam {string} title title of meeting
     * @apiParam {string} description meeting's description
     * @apiParam {String} category_id category's id
     * @apiParam {string} begin begin date
     * @apiParam {String} end end date
     * @apiParam {String} status  1: actived
     *                      <br/> 0: expired
     * @apiParam {String} limited maximun number of people attend
     * @apiParam {String} currentAttend number of people have register
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/meetings/2
     *
     * @apiSuccess {String} id the ID of updated meetings
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2"
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
    app.put('/v1/auth/meetings/:id', MeetingCtrl.update);
    app.put('/v1/auth/meetings/deletes', MeetingCtrl.update);
    /**
     * @api {DELETE} /v1/auth/meetings/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup Meetings
     * @apiPermission just admin user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete meetings
     *
     * @apiParam {String} id ID of meetings
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/meetings/2
     *
     * @apiSuccess {String} id Id of deleted meetings
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2"
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
    app.delete('/v1/auth/meetings/:id', MeetingCtrl.delete);
}