const ProcessesCtrl = require('../controllers/ProcessesCtrl');

module.exports = function(app) {

    app.put('/v1/auth/processes/:id', ProcessesCtrl.update);

}