const HashtagCtrl = require('../controllers/HashtagCtrl');

module.exports = function(app) {
    /**
     * @api {GET} /v1/auth/hashtags Get All
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup Hashtags
     * @apiPermission User
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all hashtag and type 
     * 
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {String} q(type) Text filter for data (N/A)
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/hashtags
     *
     * @apiSuccess {String} [value] Hashtag's value
     * @apiSuccess {String} [type] Hashtag's type
     *                                          <br/> 1: location
     *                                          <br/> 2: type
     *                                          <br/> 3: description
     * @apiSuccess {String} [status] Hashtag's status
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                "count": 45,
                "rows": [
                    {
                        "id": 20,
                        "value": "Hà Nội",
                        "type": 1,
                        "status": 1,
                        "createdBy": 1,
                        "updatedBy": 1,
                        "createdAt": "2020-09-23T11:26:05.000Z",
                        "updatedAt": "2020-09-23T11:26:05.000Z"
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
    app.get('/v1/auth/hashtags', HashtagCtrl.getAll);

    /**
     * @api {PUT} /v1/auth/hashtags/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup Hashtags
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update Hashtags information
     * 
     * @apiParam {string} id ID of category, on params
     *
     * @apiParam {String} value Hashtag's value
     * @apiParam {String} type Hashtag's type
     *                                          <br/> 1: location
     *                                          <br/> 2: type
     *                                          <br/> 3: description
     * @apiParam {String} status Hashtag's status
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/hashtags/2
     *
     * @apiSuccess {String} id the ID of updated hashtags
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
    app.put('/v1/auth/hashtags/:id', HashtagCtrl.update);
    app.put('/v1/auth/hashtags/deletes', HashtagCtrl.update);

    /**
     * @api {DELETE} /v1/auth/hashtags/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup Hashtags
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete hashtags
     *
     * @apiParam {String} id ID of hashtags
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/hashtags/2
     *
     * @apiSuccess {String} id Id of deleted hashtags
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
    app.delete('/v1/auth/hashtags/:id', HashtagCtrl.delete);

    /**
     * @api {POST} /v1/auth/hashtags Create One
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup Hashtags
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create by admin, moderator
     *
     * @apiParam {String} value Hashtag's value
     * @apiParam {String} type Hashtag's type
     *                                          <br/> 1: location
     *                                          <br/> 2: type
     *                                          <br/> 3: description
     * @apiParam {String} [status] Hashtag's status   
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/hashtags
     *
     * @apiSuccess {String} id the ID of created hashtags
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
    app.post('/v1/auth/hashtags', HashtagCtrl.create);

}