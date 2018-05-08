var response = require('../utils/utils');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

var config         = require('../config/config');
var labels         = require('../config/labels');
var jwt            = require('jwt-simple');

exports.add = function(req, res) {
    try {
        if(!req.body.name){
            res.status(400).send(response.errorResponse(400, labels.ERRA001));
        }else if(!req.body.lastName){
            res.status(400).send(response.errorResponse(400, labels.ERRA002));
        }else if(!req.body.email){
            res.status(400).send(response.errorResponse(400, labels.ERRA003));
        }else if(!req.body.password || req.body.password.length < 4 || req.body.password.length > 8){
            res.status(400).send(response.errorResponse(400, labels.ERRA004));
        }else{
            var user = new User({
                name: req.body.name.toUpperCase(),
                lastName: req.body.lastName.toUpperCase(),
                email: req.body.email.toLowerCase(),
                password: req.body.password.toLowerCase(),
                linkedin: req.body.linkedin,
                company: req.body.company,
                facebook: req.body.facebook,
                image: req.body.image,
                imagenUrl: req.body.imagenUrl,
                job: req.body.job,
                occupation: req.body.occupation,
                share: req.body.share,
                twitter: req.body.twitter
            });
            user.password = bcrypt.hashSync(user.password);
            var query = User.findOne({ email: user.email }).exec();
            query.then(function(checkUser){
                if(checkUser){
                    res.status(400).jsonp(response.errorResponse(400, labels.ERRA005));
                }else{
                    var query2 = user.save();
                    query2.then(function(user_){
                        var _user = {
                            _id : user_._id,
                            name: user.name,
                            lastName: user.lastName,
                            token: '',
                            ts: Date.now()
                        };
                        var token = jwt.encode(_user, config.secret);
                        _user.token = 'JWT '+ token;
                        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, _user));
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

exports.getUserCard = function(req, res) {
    try {
        if (!response.isValidID(req.params.id)){
            res.status(500).send(response.errorResponse(400,labels.ERRA005));
        }else{
            var query = User.findById(req.params.id).exec();
            query.then(function(user){
                if(user){
                    var r_user = {
                        name: user.name,
                        lastName: user.lastName,
                        email: user.email,
                        facebook: user.facebook,
                        twitter: user.twitter,
                        linkedin: user.linkedin,
                        occupation: user.occupation,
                        company: user.company,
                        job: user.job,
                        imageUrl: user.imageUrl,
                        image: user.image,
                        _id: user._id
                    };
                    res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_user));
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

exports.authentication = function(req, res) {
    try {
        if(!req.body.email){
            res.status(400).send(response.errorResponse(400, labels.ERRA003));
        }
        var email = req.body.email.toLowerCase();
        var query = User.findOne({ email: email }).exec();
        query.then(function(user){
            if(user){
                if(req.body.password){
                    var password =  req.body.password.toLowerCase();
                    if(bcrypt.compareSync(password, user.password)){
                        var _user = {
                            _id : user._id,
                            name: user.name,
                            lastName: user.lastName,
                            token: '',
                            ts: Date.now()
                        };
                        var token = jwt.encode(_user, config.secret);
                        _user.token = 'JWT '+ token;
                        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, _user));
                    }else{
                        res.status(400).send(response.errorResponse(400, labels.ERRA009));
                    }
                }else if (req.body.linkedIn){
                    var linkedIn =  req.body.linkedIn;
                    if(linkedIn == user.linkedIn){
                        var _user = {
                            _id : user._id,
                            name: user.name,
                            lastName: user.lastName,
                            token: '',
                            ts: Date.now()
                        };
                        var token = jwt.encode(_user, config.secret);
                        _user.token = 'JWT '+ token;
                        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, _user));
                    }else{
                        res.status(400).send(response.errorResponse(400, labels.ERRA010));
                    }
                }else{
                    res.status(400).send(response.errorResponse(500,labels.ERRA006));
                }
            }else{
                res.status(400).send(response.errorResponse(400, labels.ERRA011));
            }
        }).catch(function(err){
            res.status(500).send(response.errorResponse(500,labels.ERRA006,err.message));
        });
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA006, handler.message));
    }
};