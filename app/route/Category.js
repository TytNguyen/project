const CategoryCtrl = require('../controllers/CategoryCtrl');

module.exports = function(app) {
    /**
     * @api {GET} /v1/auth/category/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne
     * @apiGroup Category
     * @apiPermission User
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one category
     *
     * @apiParam {string} id ID of category, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/category/2
     *
     * @apiSuccess {String} id the ID of category
     * @apiSuccess {String} mainsubject category's name
     * @apiSuccess {String} status status of category
     * @apiSuccess {String} id subcategories's id
     * @apiSuccess {String} subject subcategory's name
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
                    "count": 10,
                    "rows": [
                        {
                            "id": 1,
                            "mainsubject": "Hóa học",
                            "status": 1,
                            "createdBy": 1,
                            "updatedBy": 1,
                            "createdAt": "2020-10-21T15:08:24.000Z",
                            "updatedAt": "2020-10-21T15:08:24.000Z",
                            "subcategories": [
                                {
                                    "id": 1,
                                    "subject": "Hóa hữu cơ"
                                },
                                {
                                    "id": 2,
                                    "subject": "Hóa lý"
                                },
                                {
                                    "id": 3,
                                    "subject": "Hóa dầu"
                                },
                                {
                                    "id": 4,
                                    "subject": "Hóa phân tích"
                                },
                                {
                                    "id": 5,
                                    "subject": "Hóa lập thể"
                                },
                                {
                                    "id": 6,
                                    "subject": "Hóa vô cơ và ứng dụng"
                                },
                                {
                                    "id": 7,
                                    "subject": "Hóa polymer"
                                },
                                {
                                    "id": 8,
                                    "subject": "Hóa dược"
                                },
                                {
                                    "id": 9,
                                    "subject": "Hóa lượng tử"
                                },
                                {
                                    "id": 10,
                                    "subject": "Hóa thực phẩm"
                                }
                            ]
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
    app.get('/v1/auth/category/:id', CategoryCtrl.getOneCategory);
    app.get('v1/auth/category/statistic', CategoryCtrl.getOneCategory);

    /**
     * @api {GET} /v1/auth/category Get List
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup Category
     * @apiPermission type of user >= 3, if type < 3, just get the category they create
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all category
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/category/
     *
     * @apiSuccess {String} id the ID of category
     * @apiSuccess {String} mainsubject category's name
     * @apiSuccess {String} status status of category
     * @apiSuccess {String} id subcategories's id
     * @apiSuccess {String} subject subcategory's name
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
    app.get('/v1/auth/category', CategoryCtrl.getAll);

    /**
     * @api {POST} /v1/auth/category Create One
     * @apiVersion 1.0.0
     * @apiName createCategory
     * @apiGroup Category
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create Category by admin, moderator
     *
     * @apiParam {String} mainsubject category's name
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/category
     *
     * @apiSuccess {String} id the ID of created category
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
    app.post('/v1/auth/category', CategoryCtrl.createCategory);

    /**
     * @api {PUT} /v1/auth/category/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup Category
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update category information
     * 
     * @apiParam {string} id ID of category, on params
     *
     * @apiParam {String} mainsubject category's name
     * @apiParam {string} status category's status
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
    app.put('/v1/auth/category/:id', CategoryCtrl.update);
    app.put('/v1/auth/category/deletes', CategoryCtrl.update);

    /**
     * @api {DELETE} /v1/auth/category/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup Category
     * @apiPermission administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete category
     *
     * @apiParam {String} id ID of category
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/category/2
     *
     * @apiSuccess {String} id Id of deleted category
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
    app.delete('/v1/auth/category/:id', CategoryCtrl.delete);
}