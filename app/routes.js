/**
 * Created by s3lab. on 1/13/2017.
 */
module.exports = function (app) {
    require('./route/User')(app);
    require('./route/Device')(app);
    require('./route/Service')(app);
    require('./route/Stakeholder')(app);
    require('./route/Meeting')(app);
    require('./route/Attendance')(app);
    require('./route/Hashtag')(app);
    require('./route/Matching')(app);
    require('./route/LabResult')(app);
    require('./route/EnterpriseProfile')(app);
    require('./route/Processes')(app);
    require('./route/Category')(app);
    require('./route/Subcategory')(app);
};
