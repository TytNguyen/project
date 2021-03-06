const MatchingCtrl = require('../controllers/MatchingCtrl');

module.exports = function(app) {
    app.get('/v1/file/:name', MatchingCtrl.downloadFile);

    /**
     * @api {GET} /v1/auth/matching/automatching Get the matchest one of your requirement
     * @apiVersion 1.0.0
     * @apiName autoMatching
     * @apiGroup Matching
     * @apiPermission type of user < 3
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Auto find the matchest one of your requirement
     *
     * @apiParam {string} id ID of requirement
     * @apiParam {string} sub_id ID of subcategory
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/matching/automatching
     *
     * @apiSuccess {String} id the ID of matching result
     * @apiSuccess {String} title result's title
     * @apiSuccess {String} description result's description
     * @apiSuccess {String} status result's status
     * @apiSuccess {String} subcategory subcategory of result
     * @apiSuccess {String} hashtag hashtag of result
     * @apiSuccess {String} percent_matching percent matching
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "id": 12,
                    "title": "Title 1",
                    "description": "Sản phẩm công nghệ cao",
                    "status": 1,
                    "createdAt": "2020-10-24T16:25:37.000Z",
                    "updatedAt": "2020-10-24T16:37:52.000Z",
                    "createdBy": 1,
                    "updatedBy": 1,
                    "subcategory": {
                        "id": 1,
                        "subject": "Hóa hữu cơ"
                    },
                   "match_hashtags": [
                    {
                        "hashtag_id": 26,
                        "hashtag": {
                            "value": "năng lực nghiên cứu",
                            "type": 2
                        }
                    }],
                    "percent_matching": 50},
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
    app.get('/v1/auth/matching/automatching', MatchingCtrl.autoMatching);

    /**
     * @api {GET} /v1/auth/matching/recommendation Get recommendation list
     * @apiVersion 1.0.0
     * @apiName recommendation
     * @apiGroup Matching
     * @apiPermission type of user < 3
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get list match with your requirement
     *
     * @apiParam {string} id ID of requirement
     * @apiParam {string} sub_id ID of subcategory of requirement
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/matching/recommendation
     *
     * @apiSuccess {String} id the ID of matching result
     * @apiSuccess {String} title result's title
     * @apiSuccess {String} description result's description
     * @apiSuccess {String} status result's status
     * @apiSuccess {String} subcategory subcategory of result
     * @apiSuccess {String} hashtag hashtag of result
     * @apiSuccess {String} percent_matching_list percent matching list with id
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
     *               "id": 12,
     *               "title": "Title 1",
     *               "description": "Sản phẩm công nghệ cao",
     *               "status": 1,
     *               "createdAt": "2020-10-24T16:25:37.000Z",
     *               "updatedAt": "2020-10-24T16:37:52.000Z",
     *               "createdBy": 1,
     *               "updatedBy": 1,
     *               "subcategory": {
     *                   "id": 1,
     *                   "subject": "Hóa hữu cơ"
     *               },
     *              "match_hashtags": [
     *               {
     *                   "hashtag_id": 26,
     *                   "hashtag": {
     *                       "value": "năng lực nghiên cứu",
     *                       "type": 2
     *                   }
     *               }],
     *               "percent_matching_list": [
     *                   [
     *                       12,
     *                       0.5
     *                   ],
     *                   [
     *                       1,
     *                      0.3333
     *                   ],
     *                   [
     *                       5,
     *                       0.1667
     *                   ]
     *               ]
     *           },
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
    app.get('/v1/auth/matching/recommendation', MatchingCtrl.recommendation);

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
     * @apiParam {string} id ID of matching, on paramss
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

    /**
     * @api {GET} v1/auth/matching/statistic Get Statistic
     * @apiVersion 1.0.0
     * @apiName getStatistic
     * @apiGroup Matching
     * @apiPermission All type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get Statistic
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/matching/statistic
     *
     * @apiSuccess {String} activated total matching that status is not in [9, 10]
     * @apiSuccess {String} expired total matching that status is in [9, 10]
     * @apiSuccess {String} total total matching
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "activated": 2,
                    "expired": 1,
                    "total": 3
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
    app.get('v1/auth/matching/statistic', MatchingCtrl.getOne);

    /**
     * @api {GET} /v1/auth/matching/getrequest Get Request
     * @apiVersion 1.0.0
     * @apiName getRequest
     * @apiGroup Matching
     * @apiPermission type of user < 3
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all Request that lab receive or company sent
     *
     * @apiParam {Number} lid ID of lab, on query
     * @apiParam {Number} cid ID of company, on query
     * @apiParam {string} Note Not use lid and cid in the same time
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/matching/getrequest?cid=4
     * curl -i http://localhost:3000/v1/auth/matching/getrequest?lid=5
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
    app.get('/v1/auth/matching/getrequest', MatchingCtrl.getOne);

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
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {Number} profileId ID of profile, on query
     * @apiParam {Number} resultId ID of result, on query
     * @apiParam {string} Note Not use profileId and resultId in the same time
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
                                    <br/> 11: Accept the meeting
                                    <br/> 11: Scheduled the meeting
                                    <br/> 13: Contracting editing
     * @apiParam {string} [note] note for step
     * @apiParam {string} [meetingAddress] Scheduled the meeting Address
     * @apiParam {string} [meetingTime] Scheduled the meeting Time
     * @apiParam {file} [file] contract file
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