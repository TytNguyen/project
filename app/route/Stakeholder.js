const StakeholderCtrl = require('../controllers/StakeholderCtrl');

module.exports = function(app) {
/**
     * @api {POST} /v1/auth/stakeholder Create One
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup Stakeholder
     * @apiPermission just administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create user by admin, moderator and user that has status similar with the stakeholder status
     *
     * @apiParam {string} name name of company or lab
     * @apiParam {string} taxcode company or lab's taxcode
     * @apiParam {String} district company or lab's district
     * @apiParam {String} detailAddress company or lab's detail address
     * @apiParam {String} phone company or lab's phone
     * @apiParam {String} type      1: company
     *                      <br/>   2: lab
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/stakeholder
     *
     * @apiSuccess {String} id the ID of created stakeholder
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
    app.post('/v1/auth/stakeholder', StakeholderCtrl.create);
    // app.post('/v1/auth/companies/notify_sync', CompanyCtrl.notifySync);
    // app.post('/v1/auth/companies/notify_upgrade', CompanyCtrl.notifyUpgrade);

    /**
     * @api {GET} /v1/auth/stakeholder/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne/getType
     * @apiGroup Stakeholder
     * @apiPermission type of user >= 3, if type < 3, just get the stakeholder they create
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one stakeholder
     *
     * @apiParam {string} id ID Use on params
     *                          <br/> Use id = 1 when call this api in customer page
     *                          <br/> Use stakeholder'id when call this api in admin page
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/stakeholder/2
     *
     * @apiSuccess {String} id the ID of group
     * @apiSuccess {String} name name of stakeholder
     * @apiSuccess {String} taxcode taxcode of stakeholder
     * @apiSuccess {String} district district of stakeholder
     * @apiSuccess {String} detailAddress detailAddress of stakeholder
     * @apiSuccess {String} type type of stakeholder
     * @apiSuccess {String} phone phone of stakeholder
     * @apiSuccess {String} status status of stakeholder
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2",
     *              "phone": "1213233453454",
     *              "name": "ilovebioz@gmail.com",
     *              "type": "1",
     *              ...
     *          },
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
    app.get('/v1/auth/stakeholder/:id', StakeholderCtrl.getOne);
    app.get('v1/auth/stakeholder/statistic', StakeholderCtrl.getOne);

    /**
     * @api {GET} /v1/auth/stakeholder Get List
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup Stakeholder
     * @apiPermission administrator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all stakeholders
     *
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {String} q(type, name, taxcode) Text filter for data (N/A)
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/stakeholder
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
    app.get('/v1/auth/stakeholder', StakeholderCtrl.getAll);

    /**
     * @api {PUT} /v1/auth/stakeholder/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup Stakeholder
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update stakeholder information
     * 
     * @apiParam {string} id ID of stakeholder (/laboratories, /companies), on params
     *
     * @apiParam {string} [name] name of company or lab
     * @apiParam {string} [taxcode] company or lab's taxcode
     * @apiParam {String} [district] company or lab's district
     * @apiParam {String} [detailaddress] company or lab's detail address
     * @apiParam {String} [phone] company or lab's phone
     * @apiParam {String} [type]  1: company
     *                      <br/> 2: lab
     * @apiParam {String} [status] status of stakeholder
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/stakeholder/2
     *
     * @apiSuccess {String} id the ID of updated stakeholder
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
    app.put('/v1/auth/stakeholder/:id', StakeholderCtrl.update);
    app.put('/v1/auth/stakeholder/deletes', StakeholderCtrl.update);

    /**
     * @api {DELETE} /v1/auth/stakeholder/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup Stakeholder
     * @apiPermission just admin user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete stakeholder
     *
     * @apiParam {String} id ID of stakeholder
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/stakeholder/2
     *
     * @apiSuccess {String} id Id of deleted stakeholder
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
    app.delete('/v1/auth/stakeholder/:id', StakeholderCtrl.delete);
}