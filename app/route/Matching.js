const MatchingCtrl = require('../controllers/MatchingCtrl');

module.exports = function(app) {
    app.get('/v1/auth/matching/test/:id', MatchingCtrl.test);

    /**
     * @api {GET} /v1/auth/matching/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne
     * @apiGroup Matching
     * @apiPermission type of user >= 3, if type < 3, just get the matching they create
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one matching
     *
     * @apiParam {string} id ID of matching, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/matching/2
     *
     * @apiSuccess {String} id the ID of matching
     * @apiSuccess {String} status status of matching
     * @apiSuccess {String} type matching's type
     * @apiSuccess {String} isCompany Company send this request or not
     * @apiSuccess {String} enterpriseprofile_id enterpriseprofile's id
     * @apiSuccess {String} enterpriseprofile_title enterpriseprofile's title
     * @apiSuccess {String} labresult_id labresult's id
     * @apiSuccess {String} labresult_title labresult's title
     * @apiSuccess {String} processes_id processes's id
     * @apiSuccess {String} step matching's step
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "id": 1,
                    "status": 5,
                    "type": 1,
                    "isCompany": 1,
                    "createdAt": "2020-10-01T13:04:58.000Z",
                    "updatedAt": "2020-10-15T20:43:38.000Z",
                    "createdBy": 1,
                    "updatedBy": 1,
                    "enterpriseprofile": {
                        "id": 1,
                        "title": "Công nghệ trồng lúa"
                    },
                    "labresult": {
                        "id": 1,
                        "title": "Title 1"
                    },
                    "processes": [
                        {
                            "id": 1,
                            "step": 1
                        },
                        {
                            "id": 3,
                            "step": 3
                        },
                        {
                            "id": 27,
                            "step": 4
                        },
                        {
                            "id": 28,
                            "step": 5
                        }
                    ]
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
    app.get('/v1/auth/matching/:id', MatchingCtrl.getOne);
    app.get('v1/auth/matching/statistic', MatchingCtrl.getOne);

    /**
     * @api {GET} /v1/auth/matching Get List
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup Matching
     * @apiPermission Admin or moderate
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all matching
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/matching/
     *
     * @apiSuccess {String} id the ID of matching
     * @apiSuccess {String} status status of matching
     * @apiSuccess {String} type matching's type
     * @apiSuccess {String} isCompany Company send this request or not
     * @apiSuccess {String} enterpriseprofile_id enterpriseprofile's id
     * @apiSuccess {String} enterpriseprofile_title enterpriseprofile's title
     * @apiSuccess {String} labresult_id labresult's id
     * @apiSuccess {String} labresult_title labresult's title
     * @apiSuccess {String} processes_id processes's id
     * @apiSuccess {String} step matching's step
     *
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
    app.get('/v1/auth/matching', MatchingCtrl.getAll);
    /**
     * @api {POST} /v1/auth/matching Create One
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup Matching
     * @apiPermission Admin
     *
     * @apiDescription Create matching by user 
     *
     * @apiParam {string} profileId Enterprise Profile id
     * @apiParam {String} resultId Lab Result id
     * @apiParam {String} step process's step
     * @apiParam {String} type 1: auto
     *                  <br/>  2: request
     * @apiParam {String} isCompany 1: true
     *                       <br/>  0: false
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/matching
     *
     * @apiSuccess {object} data the matching data with token
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data":{
     *          "profileId": "12",
     *          "resultId":2,
     *          "type": "1",
     *          "isCompany": "1"
     *          "status": 1
     *       },
     *       "result": "ok",
     *       "message":""
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
    app.post('/v1/auth/matching', MatchingCtrl.create);
    /**
     * @api {PUT} /v1/auth/matching/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup Matching
     * @apiPermission Admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update matching and processes information
     *
     * @apiParam {string} [step]    1: waiting for accept
                                    <br/> 2: Accept (call the client, choose date to meeting)
                                    <br/> 3: organize the meeting
                                    <br/> 4: waiting for accept agreement
                                    <br/> 5: contract
                                    <br/> 6: support
                                    <br/> 7: Done
                                    <br/> 8: Pending
                                    <br/> 9: Canceled
                                    <br/> 10: Rejected
     * @apiParam {string} [note] note for step
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/matching/2
     *
     * @apiSuccess {String} id the ID of updated matching
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
    app.put('/v1/auth/matching/:id', MatchingCtrl.update);
}