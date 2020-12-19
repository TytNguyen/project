/**
 * Created by s3lab. on 1/13/2017.
 */
// our components
const UserCtrl = require('../controllers/UserCtrl');
const sendGrid = require('../config/SendMail');


module.exports = function (app) {
    app.post('/v1/test', UserCtrl.test);

    // app.get('/v1/verify/:token', UserCtrl.verifyAccount);

    // app.post('/v1/user/upload', UserCtrl.uploadImageToFirebase);

    /**
     * @api {POST} /v1/auth/users Create by admin
     * @apiVersion 1.0.0
     * @apiName createByAdmin
     * @apiGroup User
     * @apiPermission just administrator or moderator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create user by admin or moderator
     *
     * @apiParam {string} phone unique phone
     * @apiParam {string} email unique email
     * @apiParam {String} password a string with 6 <= length <= 64
     * @apiParam {string} [status]    1: activated
     *                          <br/> 0: deleted 
     * @apiParam {String} [firstName] first name of user
     * @apiParam {file} [file] image
     * @apiParam {String} [lastName] last name of user
     * @apiParam {String} [type]  1: company
     *                      <br/> 2: lab
     *                      <br/> 3: moderate
     *                      <br/> 4: admin
     *                      <br/> 5: superadmin 
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users
     *
     * @apiSuccess {String} id the ID of created user
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
    app.post('/v1/auth/users', UserCtrl.createByAdmin);
    /**
     * @api {POST} /v1/login Login
     * @apiVersion 1.0.0
     * @apiName login
     * @apiGroup User
     * @apiPermission Every one
     *
     * @apiDescription login and get access token
     *
     * @apiParam {string} userName a string with length <= 64, can be a phone or email
     * @apiParam {String} password a string with 4 < length < 64
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/login
     *
     * @apiSuccess {object} data the user data with token
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data":{
     *          "token": "abc",
     *          "id":2,
     *          "loginName": "admin",
     *          "phone": "0123456789"
     *          "status": 1
     *          "type": 1
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
    app.post('/v1/login', UserCtrl.login);
    /**
     * @api {GET} /v1/auth/users/:id Get One
     * @apiVersion 1.0.0
     * @apiName getOne
     * @apiGroup User
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one user
     *
     * @apiParam {string} id ID of user, on params
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/2
     *
     * @apiSuccess {String} id the ID of group
     * @apiSuccess {String} phone phone of user
     * @apiSuccess {String} email email of user
     * @apiSuccess {String} displayName displayName of user
     * @apiSuccess {String} type type of user
     * @apiSuccess {String} status status of user
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2",
     *              "phone": "1213233453454",
     *              "email": "ilovebioz@gmail.com",
     *              "status": "1",
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
    app.get('/v1/auth/users/:id', UserCtrl.getOne);
    app.get('/v1/auth/users/statistic', UserCtrl.getOne);
    /**
     * @api {GET} /v1/auth/users Get List
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup User
     * @apiPermission administrator
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all users
     *
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {String} q(email, type, status) Text filter for data (N/A)
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users
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
    app.get('/v1/auth/users', UserCtrl.getAll);
    /**
     * @api {PUT} /v1/auth/users/:id Update One
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup User
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update user information
     *
     * @apiParam {String} id ID of user, on params
     * @apiParam {String} [type] type of user
     * @apiParam {String} [status] status of user
     * @apiParam {String} [firstName] first name of user
     * @apiParam {String} [lastName] last name of user
     * @apiParam {String} [displayName] displayName of user
     * @apiParam {file} [file] user's image
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/2
     *
     * @apiSuccess {String} id the ID of updated user
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
    app.put('/v1/auth/users/:id', UserCtrl.update);
    /**
     * @api {PUT} /v1/auth/users/updatepassword Update Password
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup User
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update user password
     *
     * @apiParam {String} id ID of user
     * @apiParam {String} oldPassword user's old password
     * @apiParam {String} newPassword user's new password
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/updatepassword
     *
     * @apiSuccess {String} id the ID of updated user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
                "data": {
                    "id": "103"
                },
                "message": "ok",
                "code": "0"
            }
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
    app.put('/v1/auth/users/updatepassword', UserCtrl.update);
/**
     * @api {PUT} /v1/auth/users/deletes Deletes list of account
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup User
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Delete list of user account
     *
     * @apiParam {String} id ID of user
     * @apiParam {String} ids account's list
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/deletes
     *
     * @apiSuccess {String} id the ID of updated user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
                "data": {
                    "id": "103"
                },
                "message": "ok",
                "code": "0"
            }
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
    app.put('/v1/auth/users/deletes', UserCtrl.update);
    /**
     * @api {DELETE} /v1/auth/users/:id Delete One
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup User
     * @apiPermission just admin user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete user
     *
     * @apiParam {String} id ID of user
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/auth/users/2
     *
     * @apiSuccess {String} id Id of deleted user
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
    app.delete('/v1/auth/users/:id', UserCtrl.delete);

    /**
     * @api {POST} /v1/users/create Create new user 
     * @apiVersion 1.0.0
     * @apiName create
     * @apiGroup User
     * @apiPermission lab or company user
     *
     * @apiDescription Create user, after that, system will send you a Email to verify your account
     * 
     * @apiParam {string} phone unique phone
     * @apiParam {string} email unique email
     * @apiParam {String} password a string with 6 <= length <= 64
     * @apiParam {string} [status]    1: activated
     *                          <br/> 0: deleted 
     * @apiParam {String} [firstName] first name of user
     * @apiParam {String} [lastName] last name of user
     * @apiParam {String} type  1: company
     *                    <br/> 2: lab
     *
     * @apiExample Example usage:
     * curl -i http://localhost:3000/v1/users/create
     *
     * @apiSuccess {String} id the ID of created user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "result": "ok",
     *       "message": "Please check your Email",
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
    app.post('/v1/users/create', UserCtrl.create);
};