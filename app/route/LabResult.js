const LabResultCtrl = require('../controllers/LabResultCtrl');

module.exports = function(app) {
    /**
     * @api {GET} /v1/auth/labresult/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne
     * @apiGroup LabResult
     * @apiPermission type of user >= 3, if type < 3, just get the labresult they create
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one labresult
     *
     * @apiParam {string} id ID of labresult, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/labresult/2
     *
     * @apiSuccess {String} id the ID of labresult
     * @apiSuccess {String} [title] labresult's title
     * @apiSuccess {String} [description] labresult's description
     * @apiSuccess {String} [status] status of labresult
     * @apiSuccess {String} [stakeholder_name] Company's name
     * @apiSuccess {String} [subcategory] subcategory's name
     * @apiSuccess {String} [hashtag_id] hashtag id
     * @apiSuccess {String} [value] hashtag's value
     * @apiSuccess {String} [type] hashtag's type
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
     *              "id": 1,
                    "title": "Công nghệ trồng lúa",
                    "description": "Sản phẩm hỗ trợ trồng cây ít bị hư",
                    "status": 1,
                    "createdAt": "2020-10-01T13:03:23.000Z",
                    "updatedAt": "2020-10-01T13:03:23.000Z",
                    "createdBy": 1,
                    "updatedBy": 1,
                    "stakeholder": {
                        "name": "Cty Nam Phương"
                    },
                    "subcategory": {
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
    app.get('/v1/auth/labresult/:id', LabResultCtrl.getOne);
    app.get('v1/auth/labresult/statistic', LabResultCtrl.getOne);

    /**
     * @api {GET} /v1/auth/labresult Get List
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup LabResult
     * @apiPermission type of user >= 3, if type < 3, just get the labresult they create
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all labresult
     * 
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {String} q(lid, subcategory_id, title, status) Text filter for data (N/A)
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/labresult/
     *
     * @apiSuccess {String} id the ID of labresult
     * @apiSuccess {String} title labresult's title
     * @apiSuccess {String} description labresult's description
     * @apiSuccess {String} status status of labresult
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
    app.get('/v1/auth/labresult', LabResultCtrl.getAll);

    /**
     * @api {PUT} /v1/auth/labresult Create One
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup LabResult
     * @apiPermission user with the right type, administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create user by admin, moderator and user belongs to LabResult
     *
     * @apiParam {string} title labresult's title
     * @apiParam {string} ids Hashtag's list
     * @apiParam {String} lid lab's id
     * @apiParam {String} subcategory_id subcategory's id
     * @apiParam {String} description labresult's description
     * @apiParam {image} file labresult's image, can put multiple file
     * 
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/labresult
     *
     * @apiSuccess {String} id the ID of created labresult
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
    app.put('/v1/auth/labresult', LabResultCtrl.create);

    /**
     * @api {PUT} /v1/auth/labresult/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup LabResult
     * @apiPermission user with the right type, administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update labresult information
     * 
    * @apiParam {string} id ID of labresult, on params
     *
     * @apiParam {string} title labresult's title
     * @apiParam {string} delete_ids Hashtag's list that deleted
     * @apiParam {string} ids Hashtag's list that added to table
     * @apiParam {String} lid lab's id
     * @apiParam {String} subcategory_id subcategory's id
     * @apiParam {String} description profile's description
     * @apiParam {String} status status of profile
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/labresult/2
     *
     * @apiSuccess {String} id the ID of updated labresult
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
    app.put('/v1/auth/labresult/:id', LabResultCtrl.update);
    app.put('/v1/auth/labresult/deletes', LabResultCtrl.update);

    /**
     * @api {PUT} /v1/auth/labresult/updateimage Update Product's Image
     * @apiVersion 1.0.0
     * @apiName updateImage
     * @apiGroup LabResult
     * @apiPermission user with the right type, administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update Product's Image
     *
     * @apiParam {string} resultId labresult's id
     * @apiParam {file} file labresult's images, can put multiple file
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/labresult/updateimage
     *
     * @apiSuccess {String} id the ID of updated labresult
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

    app.put('/v1/auth/labresult/updateimage', LabResultCtrl.update);

    /**
     * @api {DELETE} /v1/auth/labresult/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup LabResult
     * @apiPermission user with the right type, administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete labresult
     *
     * @apiParam {String} id ID of labresult
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/labresult/2
     *
     * @apiSuccess {String} id Id of deleted labresult
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
    app.delete('/v1/auth/labresult/:id', LabResultCtrl.delete);
}