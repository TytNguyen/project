const EnterpriceProfileCtrl = require('../controllers/EnterpriseProfileCtrl');

module.exports = function(app) {
    /**
     * @api {GET} /v1/auth/profile/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne
     * @apiGroup Profile
     * @apiPermission type of user >= 3, if type < 3, just get the profile they create
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one profile
     *
     * @apiParam {string} id ID of profile, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/profile/2
     *
     * @apiSuccess {String} id the ID of profile
     * @apiSuccess {String} title profile's title
     * @apiSuccess {String} description profile's description
     * @apiSuccess {String} status status of profile
     * @apiSuccess {String} stakeholder_name Company's name
     * @apiSuccess {String} subcategory subcategory's name
     * @apiSuccess {String} hashtag_id hashtag id
     * @apiSuccess {String} value hashtag's value
     * @apiSuccess {String} type hashtag's type
     * @apiSuccess {String} id stakeholder's id
     * @apiSuccess {String} id subcategory's id
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "id": 1,
                    "title": "Công nghệ trồng lúa",
                    "description": "Sản phẩm hỗ trợ trồng cây ít bị hư",
                    "status": 1,
                    "createdAt": "2020-10-01T13:03:23.000Z",
                    "updatedAt": "2020-10-01T13:03:23.000Z",
                    "createdBy": 1,
                    "updatedBy": 1,
                    "stakeholder": {
                        "id": 1,
                        "name": "Cty Nam Phương"
                    },
                    "subcategory": {
                        "id": 33,
                        "subject": "Vi sinh"
                    },
                    "match_hashtags": [
                        {
                            "hashtag_id": 51,
                            "hashtag": {
                                "value": "phòng bệnh",
                                "type": 3
                            }
                        },
                        {
                            "hashtag_id": 23,
                            "hashtag": {
                                "value": "Hải Phòng",
                                "type": 1
                            }
                        },
                        {
                            "hashtag_id": 26,
                            "hashtag": {
                                "value": "năng lực nghiên cứu",
                                "type": 2
                            }
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
    app.get('/v1/auth/profile/:id', EnterpriceProfileCtrl.getOne);

    /**
     * @api {GET} v1/auth/profile/statistic Get Statistic
     * @apiVersion 1.0.0
     * @apiName getStatistic
     * @apiGroup Profile
     * @apiPermission All type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get Statistic
     *
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/profile/statistic
     *
     * @apiSuccess {String} activated total profile that status is equal 1
     * @apiSuccess {String} expired total profile that status is equal 0
     * @apiSuccess {String} total total profile
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
    app.get('/v1/auth/profile/statistic', EnterpriceProfileCtrl.getOne);

    /**
     * @api {GET} /v1/auth/profile Get List
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup Profile
     * @apiPermission type of user >= 3, if type < 3, just get the profile they create
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all profile
     * 
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {String} q(cid, subcategory_id, title, status) Text filter for data (N/A)
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/profile/
     *
     * @apiSuccess {String} id the ID of profile
     * @apiSuccess {String} title profile's title
     * @apiSuccess {String} description profile's description
     * @apiSuccess {String} status status of profile
     * @apiSuccess {String} stakeholder_name Company's name
     * @apiSuccess {String} subcategory subcategory's name
     * @apiSuccess {String} hashtag_id hashtag id
     * @apiSuccess {String} value hashtag's value
     * @apiSuccess {String} type hashtag's type
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
    app.get('/v1/auth/profile', EnterpriceProfileCtrl.getAll);

    /**
     * @api {GET} /v1/auth/profile/getrelate Get requirement related to product
     * @apiVersion 1.0.0
     * @apiName getRelate
     * @apiGroup Profile
     * @apiPermission type of user = 2
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get 3 requirement related to product
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/profile/getrelate
     *
     * @apiSuccess {String} id the ID of profile
     * @apiSuccess {String} title profile's title
     * @apiSuccess {String} description profile's description
     * @apiSuccess {String} status status of profile
     * @apiSuccess {String} stakeholder_name Company's name
     * @apiSuccess {String} subcategory subcategory's name
     * @apiSuccess {String} hashtag_id hashtag id
     * @apiSuccess {String} value hashtag's value
     * @apiSuccess {String} type hashtag's type
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": [...],
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
    app.get('/v1/auth/profile/getrelate', EnterpriceProfileCtrl.getOne);

    /**
     * @api {POST} /v1/auth/profile Create One
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup Profile
     * @apiPermission user with the right type, administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create user by admin, moderator and user belongs to Company
     *
     * @apiParam {string} title profile's title
     * @apiParam {string} ids Hashtag's list
     * @apiParam {String} cid company's id
     * @apiParam {String} subcategory_id subcategory's id
     * @apiParam {String} description profile's description
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/profile
     *
     * @apiSuccess {String} id the ID of created profile
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
    app.post('/v1/auth/profile', EnterpriceProfileCtrl.create);

     /**
     * @api {PUT} /v1/auth/profile/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup Profile
     * @apiPermission user with the right type, administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update profile information
     * 
     * @apiParam {string} id ID of profile, on params
     *
     * @apiParam {string} [title] profile's title
     * @apiParam {string} [delete_ids] Hashtag's list that deleted
     * @apiParam {string} [ids] Hashtag's list that added to table
     * @apiParam {String} [cid] company's id
     * @apiParam {String} [subcategory_id] subcategory's id
     * @apiParam {String} [description] profile's description
     * @apiParam {String} [status] status of profile
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/profile/2
     *
     * @apiSuccess {String} id the ID of updated profile
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
    app.put('/v1/auth/profile/:id', EnterpriceProfileCtrl.update);
    app.put('/v1/auth/profile/deletes', EnterpriceProfileCtrl.update);

    /**
     * @api {DELETE} /v1/auth/profile/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup Profile
     * @apiPermission user with the right type, administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete profile
     *
     * @apiParam {String} id ID of profile
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/profile/2
     *
     * @apiSuccess {String} id Id of deleted profile
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
    app.delete('/v1/auth/profile/:id', EnterpriceProfileCtrl.delete);
}