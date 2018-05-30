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
                telephone: req.body.telephone,
                facebook: req.body.facebook,
                image: req.body.image,
                imageurl: req.body.imageurl,
                job: req.body.job,
                occupation: req.body.occupation,
                share: req.body.share,
                twitter: req.body.twitter
            });
            user.password = bcrypt.hashSync(user.password);

            var query = User.findOne({ email: user.email }).exec();
            query.then(function(checkUser){
                if(checkUser){
                    var _user = {
                        email: checkUser.email,
                        password: checkUser.password,
                        linkedin: checkUser.linkedin,
                        company: checkUser.company,
                        telephone: checkUser.telephone,
                        facebook: checkUser.facebook,
                        image: checkUser.image,
                        imageurl: checkUser.imageurl,
                        job: checkUser.job,
                        occupation: checkUser.occupation,
                        share: checkUser.share,
                        twitter: checkUser.twitter,
                        _id : checkUser._id,
                        name: checkUser.name,
                        lastName: checkUser.lastName,
                        token: '',
                        ts: Date.now(),
                        existe: true
                    };
                    var token = jwt.encode(_user, config.secret);
                    _user.token = 'JWT '+ token;
                    res.status(200).jsonp(response.successfulResponse(labels.SUCC000, _user));
                }else{
                    var query2 = user.save();
                    query2.then(function(user_){
                        var _user = {
                            _id : user_._id,
                            name: user.name,
                            lastName: user.lastName,
                            token: '',
                            ts: Date.now(),
                            existe: false
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

exports.update = function(req, res){    
    var query = User.findById(req.params.id).exec();
    query.then(function(userUPdate){
        if(userUPdate){
            userUPdate.name = req.body.name.toUpperCase();
            userUPdate.lastName= req.body.lastName.toUpperCase();
            userUPdate.email= req.body.email.toLowerCase();
            userUPdate.password= req.body.password.toLowerCase();
            userUPdate.linkedin= req.body.linkedin;
            userUPdate.company= req.body.company;
            userUPdate.telephone= req.body.telephone;
            userUPdate.facebook= req.body.facebook;
            userUPdate.image= req.body.image;
            userUPdate.imageurl= req.body.imageurl;
            userUPdate.job= req.body.job;
            userUPdate.occupation= req.body.occupation;
            userUPdate.share= req.body.share;
            userUPdate.twitter= req.body.twitter;

            var query2 = userUPdate.save();
            query2.then(function(userUPdate_){
                res.status(200).jsonp(response.successfulResponse('OK', userUPdate_));
            }).catch(function(err){
                res.status(500).send(response.errorResponse(500, err.message));
            });

        }else{
            res.status(400).jsonp(response.errorResponse(400, 'El usuario indicada no es válido'));
        }
    }).catch(function(err){
        res.status(500).send(response.errorResponse(500, err.message));
    });
};

exports.updateShareState = function(req, res){    
    var query = User.findById(req.params.idUser).exec();
    query.then(function(userUPdate){
        if(userUPdate){
            userUPdate.share= req.params.share;
            var query2 = userUPdate.save();
            query2.then(function(userUPdate_){
                res.status(200).jsonp(response.successfulResponse('OK SHARE UPDATE', userUPdate_));
            }).catch(function(err){
                res.status(500).send(response.errorResponse(500, err.message));
            });
        }else{
            res.status(400).jsonp(response.errorResponse(400, 'El usuario indicada no es válido'));
        }
    }).catch(function(err){
        res.status(500).send(response.errorResponse(500, err.message));
    });
};

exports.getUserCardShort = function(req, res) {
    try {
        if (!response.isValidID(req.params.id)){
            res.status(500).send(response.errorResponse(500,labels.ERRA005));
        }else{
            var query = User.findById(req.params.id).exec();
            query.then(function(user){
                if(user){
                    var r_user = {
                        name: user.name,
                        lastName: user.lastName,
                        occupation: user.occupation,
                        company: user.company,
                        job: user.job,
                        imageurl: user.imageurl,
                        image: user.image,
                        _id: user._id
                    };
                    res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_user));
                }else{
                    res.status(400).jsonp(response.errorResponse(400,labels.EERA018))
                }
            }).catch(function(err){
                res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA006, handler.message));
    }
};

exports.getUserCard = function(req, res) {
    try {
        if (!response.isValidID(req.params.id)){
            res.status(500).send(response.errorResponse(500,labels.ERRA005));
        }else{
            var query = User.findById(req.params.id).exec();
            query.then(function(user){
                if(user){
                    var r_user = {
                        name: user.name,
                        lastName: user.lastName,
                        email: user.email,
                        telephone: user.telephone,
                        facebook: user.facebook,
                        twitter: user.twitter,
                        linkedin: user.linkedin,
                        occupation: user.occupation,
                        company: user.company,
                        job: user.job,
                        imageurl: user.imageurl,
                        image: user.image,
                        _id: user._id
                    };
                    res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_user));
                }else{
                    res.status(400).jsonp(response.errorResponse(400,labels.EERA018))
                }
            }).catch(function(err){
                res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA006, handler.message));
    }
};

exports.addContact = function(req, res) {
    try {
        if (!response.isValidID(req.body.idUser)){
                    res.status(500).send(response.errorResponse(500,labels.ERRA005));
        } else if (!response.isValidID(req.body.idContact)){
            res.status(500).send(response.errorResponse(500,labels.ERRA005));
        }else{
            
            var query = User.findById(req.body.idUser).exec();
            query.then(function(user){
                if(user) {
                    var codeContact = false;
                    user.contacts.forEach(function(contact){
                        if(contact.idContact == req.body.idContact){
                            codeContact = true;

                            contact.idContact= req.body.idContact;
                            contact.eventName= req.body.eventName;
                            contact.contactImageurl= req.body.contactImageurl;
                            contact.contactName= req.body.contactName;
                            contact.contactCompany= req.body.contactCompany;
                            contact.contactJob= req.body.contactJob;
                            contact.contactOccupation= req.body.contactOccupation;

                            var query2 = user.save();
                            query2.then(function(user_){
                                res.status(200).jsonp(response.successfulResponse('UPDATE OK', user_.contacts));
                            }).catch(function(err){
                                res.status(500).send(response.errorResponse(500, err.message));
                            });
                        }
                    });
                    if(!codeContact){
                        var newContact = {
                            idContact : req.body.idContact,
                            eventName: req.body.eventName,
                            contactImageurl: req.body.contactImageurl,
                            contactName: req.body.contactName,
                            contactCompany: req.body. contactCompany,
                            contactJob: req.body. contactJob,
                            contactOccupation: req.body. contactOccupation
                        }

                        user.contacts.push(newContact);
                        var query_res = user.save();
                        query_res.then(function(respuesta) {
                            if(respuesta){
                                res.status(200).jsonp(response.successfulResponse(labels.SUCC015,user.contacts));
                            }else{
                                res.status(400).jsonp(response.errorResponse(400,labels.ERRA016))
                            }
                        }).catch(function(err){
                            res.status(500).jsonp(response.errorResponse(500,labels.ERRA016, err.message));
                        });
                    }
                } else {
                    res.status(400).jsonp(response.errorResponse(400,labels.ERRA016));
                }
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA006, handler.message));
    }

}

exports.listContacts = function(req, res) {
    try {
        if (!response.isValidID(req.params.idUser)){
                    res.status(500).send(response.errorResponse(500,labels.ERRA005));
        } else {
            var query = User.findById(req.params.idUser).exec();
            query.then(function(user){
                if(user) {
                    res.status(200).jsonp(response.successfulResponse(labels.SUCC016,user.contacts));
                }else{
                    res.status(400).jsonp(response.errorResponse(400,labels.EERA018))
                }
            }).catch(function(err){
                res.status(500).jsonp(response.errorResponse(500,labels.EERA018, err.message));
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA006, handler.message));
    }
}

exports.listActiveUsers = function(req, res) {
    var query = User.find({"share": true}).sort( { lastName: 1 } ).exec();

    var r_user_list= [];
    query.then(function(users){
        users.forEach(function(user){
            var r_user = {
                name: user.name.toLowerCase(),
                lastName: user.lastName.toLowerCase(),
                occupation: user.occupation,
                company: user.company,
                job: user.job,
                imageurl: user.imageurl,
                image: user.image,
                _id: user._id
            };
            r_user_list.push(r_user);
        });

        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_user_list));
    }).catch(function(err){
        res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
    });
}

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