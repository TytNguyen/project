const SubCategoryCtrl = require('../controllers/SubCategoryCtrl');

module.exports = function(app) {
    /**
     * @api {GET} /v1/auth/subcategory Get Statistic
     * @apiVersion 1.0.0
     * @apiName getStatistic
     * @apiGroup SubCategory
     * @apiPermission All users
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get Statistic
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/subcategory
     *
     * @apiSuccess {String} activated Subcategory work
     * @apiSuccess {String} deleted Subcategory deleted
     * @apiSuccess {String} total total of Subcategory
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "activated": 19,
                    "deleted": 0,
                    "total": 19
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
    app.get('/v1/auth/subcategory', SubCategoryCtrl.getStatistic);

    /**
     * @api {POST} /v1/auth/subcategory Create One
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup SubCategory
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create subcategory by admin, moderator
     *
     * @apiParam {string} subject subcategory's title
     * @apiParam {string} categoryid category's id
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/subcategory
     *
     * @apiSuccess {String} id the ID of created subcategory
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
    app.post('/v1/auth/subcategory', SubCategoryCtrl.create);

    /**
     * @api {POST} /v1/auth/subcategory/creates Create Multiple subcategory
     * @apiVersion 1.0.0
     * @apiName creates
     * @apiGroup SubCategory
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create subcategory by admin, moderator
     *
     * @apiParam {array} ids list of subcategory's title 
     * @apiParam {string} categoryid category's id
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/subcategory/creates
     *
     * @apiSuccess {String} id the ID of created subcategory
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
    app.post('/v1/auth/subcategory/creates', SubCategoryCtrl.creates);

    /**
     * @api {PUT} /v1/auth/subcategory/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup SubCategory
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update subcategory information
     * 
     * @apiParam {string} id ID of subcategory, on params
     *
     * @apiParam {string} [subject] subcategory's title
     * @apiParam {string} [categoryid] category's id
     * @apiParam {String} [status] status of category
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/category/2
     *
     * @apiSuccess {String} id the ID of updated category
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
    app.put('/v1/auth/subcategory/:id', SubCategoryCtrl.update);
    app.put('/v1/auth/subcategory/deletes', SubCategoryCtrl.update);

    /**
     * @api {DELETE} /v1/auth/subcategory/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup SubCategory
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete subcategory
     *
     * @apiParam {String} id ID of subcategory
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/subcategory/2
     *
     * @apiSuccess {String} id Id of deleted subcategory
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
    app.delete('/v1/auth/subcategory/:id', SubCategoryCtrl.delete);
}