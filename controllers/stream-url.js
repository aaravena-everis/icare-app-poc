var response = require('../utils/utils');
var config         = require('../config/config');
var labels         = require('../config/labels');
var mongoose = require('mongoose');
var StreamBD = mongoose.model('stream-url');

exports.getStreamUrl = function(req, res) {
    var query = StreamBD.find({}).exec();

    console.log("--BD--")
    console.log(query)
    query.then(function(streamUrls){
        console.log("---STREAMURLS---")
        console.log(streamUrls)
        var r_stream
        streamUrls.forEach(function(streamUrl){
            console.log('---urle---')
            console.log(streamUrl)
            r_stream = {
                urlStream: streamUrl.urlStream,
                active: streamUrl.active,
            };
        });
        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_stream));
    }).catch(function(err){
        res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
    });
};