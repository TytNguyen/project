const Meeting = require('../models/Meeting');
const moment = require("moment");
const Sequelize = require('sequelize');

function checkDate(callback) {
    const now = moment(Date.now()).utc().format('YYYY-MM-DD');

    try {
        Meeting.findAll({
            attributes: ['begin', 'id'],
        }).then(data=>{
            "use strict";
            let ids = []
            for (var i of data.values()) {
                var date = moment(i.begin);
                var dateComponent = date.utc().format('YYYY-MM-DD');
                if (now === dateComponent) {
                    ids.push(i.id);
                }
            }
            Meeting.update(
                {status: 0},
                {where: {id: {[Sequelize.Op.in]: ids}}}).then(result=>{
                    "use strict";
                    return callback(result);
            }).catch(function(error){
                "use strict";
                return callback(error);
            });
        }).catch(function(error) {
            "use strict";
             return callback(error);
        });
    }catch(error){
        console.log(error)
        return callback(error);
    }
}

module.exports = {checkDate}