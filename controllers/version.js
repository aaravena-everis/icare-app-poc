var response = require('../utils/utils');
var config         = require('../config/config');
var labels         = require('../config/labels');
var mongoose = require('mongoose');
var VersionBD = mongoose.model('version');

exports.getVersion = function(req, res) {
    try {
        var query = VersionBD.find({ "nombre": req.params.nombre }).exec();
        query.then(function(version){
            if(version){
                res.status(200).jsonp(response.successfulResponse(labels.SUCC000, version));
            }else{
                res.status(400).jsonp(response.errorResponse(400,labels.ERRA007))
            }
        }).catch(function(err){
            res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
        });
        
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA006, handler.message));
    }
};