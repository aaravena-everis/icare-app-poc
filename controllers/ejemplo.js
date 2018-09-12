var response = require('../utils/utils');
var config         = require('../config/config');
var labels         = require('../config/labels');
var mongoose = require('mongoose');
var Ejemplo = mongoose.model('ejemplo');


exports.listar = function(req, res) {

    var query = Ejemplo.find({}).exec();

    var r_ejemplo_list= [];
    query.then(function(ejemplos){
        ejemplos.forEach(function(ejemplo){
            var r_ejemplo = {
                name: ejemplo.name,
                image: ejemplo.name,
                id: ejemplo._id
            };
            r_ejemplo_list.push(r_ejemplo);
        });
        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_ejemplo_list));
    }).catch(function(err){
        res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
    });
};

exports.detalle = function(req, res) {
	try {
        if (!response.isValidID(req.params.id)){
            res.status(500).send(response.errorResponse(400,labels.ERRA005));
        }else{
            var query = Ejemplo.findById(req.params.id).exec();
            query.then(function(ejemplo){
                if(ejemplo){
                    res.status(200).jsonp(response.successfulResponse(labels.SUCC000, ejemplo));
                }else{
                    res.status(400).jsonp(response.errorResponse(400,labels.ERRA007))
                }
            }).catch(function(err){
                res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA006, handler.message));
    }
};

exports.agregar = function(req, res) {
	try {
        if(!req.body.name){
            res.status(400).send(response.errorResponse(400, labels.ERRA001));
        }else{
            var ejemplo = new Ejemplo({
                name: req.body.name,
                image: req.body.image
            });

            var query = Ejemplo.findOne({ name: ejemplo.email }).exec();
            query.then(function(checkEjemplo){
                if(checkEjemplo){
                    var _ejemplo = {
                        name: checkEjemplo.email,
                        image: checkEjemplo.password,                       
                        _id : checkEjemplo._id,
                        existe: true
                    };
                    res.status(200).jsonp(response.successfulResponse(labels.SUCC000, _ejemplo));
                }else{
                   var query2 = ejemplo.save();
                    query2.then(function(ejemplo_){
                        var _ejemplo = {
                            _id : ejemplo_._id,
                            name: ejemplo.name,
                            image: ejemplo.image,
                            existe: false
                        };
                        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, _ejemplo));
                    }).catch(function(err_){
                        res.status(500).send(response.errorResponse(500,labels.ERRA006,err_.message));
                    });
                }
            }).catch(function(err){
                res.status(500).send(response.errorResponse(500,labels.ERRA006, err.message));
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA006, handler.message));
    }

};
