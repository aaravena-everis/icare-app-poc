var response = require('../utils/utils');
var config         = require('../config/config');
var labels         = require('../config/labels');
var mongoose = require('mongoose');
var Event = mongoose.model('event');


exports.getAllEvents = function(req, res) {
    var today = new Date();
    //today.setHours(-3,0,0,0);
    today.setHours(today.getHours()-4)

    var query = Event.find({time_end: {$gte: today}}).exec();
    //var query = Event.find({}).exec();
    var r_event_list= [];
    query.then(function(events){
        events.forEach(function(event){
            var r_event = {
                title: event.title,
                subtitle: event.subtitle,
                date: event.date,
                location: event.location.name,
                image: event.image,
                featured: event.featured,
                id: event._id
            };
            r_event_list.push(r_event);
        });
        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_event_list));
    }).catch(function(err){
        res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
    });
};

exports.getFeaturedEvents = function(req, res) {
    var today = new Date();
    //today.setHours(-3,0,0,0);
    today.setHours(today.getHours()-4)

    var query = Event.find({time_end: {$gte: today}, "featured": true }).exec();
    //var query = Event.find({"featured": true }).exec();
    var r_event_list= [];
    query.then(function(events){
        events.forEach(function(event){
            var r_event = {
                title: event.title,
                subtitle: event.subtitle,
                date: event.date,
                location: event.location.name,
                image: event.image,
                featured: event.featured,
                id: event._id
            };
            r_event_list.push(r_event);
        });
        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_event_list));
    }).catch(function(err){
        res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
    });
};

exports.getArchiveEvents = function(req, res) {
    var today = new Date();
    //today.setHours(-3,0,0,0);
    today.setHours(today.getHours()-4)

    var query = Event.find({time_start: {$lte: today}, "archived": true, "featured": true}).exec();
    //var query = Event.find({"archived": true }).exec();
    var r_event_list= [];
    query.then(function(events){
        events.forEach(function(event){
            var r_event = {
                title: event.title,
                subtitle: event.subtitle,
                date: event.date,
                location: event.location.name,
                image: event.image,
                featured: event.featured,
                archived: event.archived,
                id: event._id
            };
            r_event_list.push(r_event);
        });
        res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_event_list));
    }).catch(function(err){
        res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
    });
};

exports.getTodayEvent = function(req, res) {

    var today = new Date();
    var today2 = new Date();
    console.log(today)
    //today.setHours(-3,0,0,0);
    today.setHours(today.getHours()-4)
    today2.setHours(today2.getHours()-2)
    console.log(today)
    console.log(today2)

    var query = Event.find({time_end: {$gte: today}, time_start: {$lte: today2}}).exec();

    var r_event_list= [];
        query.then(function(events){
            events.forEach(function(event){
                var r_event = {
                    title: event.title,
                    subtitle: event.subtitle,
                    date: event.date,
                    location: event.location.name,
                    image: event.image,
                    featured: event.featured,
                    id: event._id,
                    time_start: event.time_start,
                    time_end: event.time_end
                };
                r_event_list.push(r_event);
            });
            res.status(200).jsonp(response.successfulResponse(labels.SUCC000, r_event_list));
        }).catch(function(err){
            res.status(500).jsonp(response.errorResponse(500,labels.ERRA006, err.message));
        });
}

exports.getEventDetail = function(req, res) {
    try {
        if (!response.isValidID(req.params.id)){
            res.status(500).send(response.errorResponse(400,labels.ERRA005));
        }else{
            var query = Event.findById(req.params.id).exec();
            query.then(function(event){
                if(event){
                    res.status(200).jsonp(response.successfulResponse(labels.SUCC000, event));
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

exports.addCommentToSessionOfEvent = function(req, res) {
    try {
        if ((!response.isValidID(req.body.idEvent)) && (!response.isValidID(req.body.idSession))){
            res.status(500).send(response.errorResponse(400,labels.ERRA005));
        } else {
            var query = Event.findById(req.body.idEvent).exec();
            query.then(function(event){
                if(event) {
                    var counter = 0;
                    var realCounter = 0;
                    event.sessions.forEach(function(session) {
                        if(session._id.toString() == req.body.idSession) {
                            realCounter = counter;
                            var comment = {
                                text : req.body.comment,
                                userName: req.body.userName
                            };
                            session.comments.push(comment);
                            var query_res = event.save();
                            query_res.then(function(respuesta) {
                                if(respuesta){
                                    res.status(200).jsonp(response.successfulResponse(labels.SUCC013, respuesta.sessions[realCounter].comments));
                                }else{
                                    res.status(400).jsonp(response.errorResponse(400,labels.ERRA003))
                                }
                            }).catch(function(err){
                                res.status(500).jsonp(response.errorResponse(500,labels.ERRA012, err.message));
                            });
                        }
                        counter++;
                    });
                } else {
                    res.status(400).jsonp(response.errorResponse(400,labels.ERRA012));
                }
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA012, handler.message));
    }
};

Array.prototype.sum = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop]
    }
    return total
}
exports.addEvaluationToSpeech = function(req, res) {
    try {
        if ((!response.isValidID(req.body.idEvent)) && (!response.isValidID(req.body.idSession)) && (!response.isValidID(req.body.idSpeech))){
            res.status(500).send(response.errorResponse(400,labels.ERRA005));
        } else {
            var query = Event.findById(req.body.idEvent).exec();
            query.then(function(event){
                if(event) {
                    event.sessions.forEach(function(session) {
                        if(session._id.toString() == req.body.idSession) {
                            session.speechs.forEach(function(speech){
                                if(speech._id.toString() == req.body.idSpeech) {
                                    var evaluation = {
                                        evaluation : parseInt(req.body.evaluation, 10)
                                    };
                                    speech.evaluations.push(evaluation);
                                    var query_res = event.save();
                                    query_res.then(function(respuesta) {
                                        if(respuesta){
                                            var promedio = Math.round((speech.evaluations.sum("evaluation")/speech.evaluations.length) * 10)/10;
                                            var response_data = {
                                                "total" : speech.evaluations.length,
                                                "average": promedio
                                            }
                                            res.status(200).jsonp(response.successfulResponse(labels.SUCC014,response_data));
                                        }else{
                                            res.status(400).jsonp(response.errorResponse(400,labels.ERRA015))
                                        }
                                    }).catch(function(err){
                                        res.status(500).jsonp(response.errorResponse(500,labels.ERRA015, err.message));
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.status(400).jsonp(response.errorResponse(400,labels.ERRA015));
                }
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA015, handler.message));
    }
};

exports.addInscription = function(req, res) {
    try {
        if ((!response.isValidID(req.body.idEvent))){
            res.status(500).send(response.errorResponse(400,labels.ERRA005));
        } else {
            var query = Event.findById(req.body.idEvent).exec();
            query.then(function(event){
                if(event) {
                    var codeUse = false;
                    event.inscriptions.forEach(function(inscription){
                        if(inscription.code == req.body.code){
                            codeUse = true;
                            res.status(400).jsonp(response.errorResponse(400,labels.ERRA017))
                        }
                    });
                    if(!codeUse){
                        var inscription = {
                            name: req.body.name,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            phone: req.body.phone,
                            company: req.body.company,
                            code: req.body.code
                        }
                        event.inscriptions.push(inscription);
                        var query_res = event.save();
                        query_res.then(function(respuesta) {
                            if(respuesta){
                                res.status(200).jsonp(response.successfulResponse(labels.SUCC015,''));
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
        res.status(500).send(response.errorResponse(500,labels.ERRA016, handler.message));
    }
};

exports.addCommentToSpeech = function(req, res) {
    try {
        if ((!response.isValidID(req.body.idEvent)) && (!response.isValidID(req.body.idSession)) && (!response.isValidID(req.body.idSpeech))){
            res.status(500).send(response.errorResponse(400,labels.ERRA005));
        } else {
            var query = Event.findById(req.body.idEvent).exec();
            query.then(function(event){
                if(event) {
                    event.sessions.forEach(function(session) {
                        if(session._id.toString() == req.body.idSession) {
                            session.speechs.forEach(function(speech){
                                if(speech._id.toString() == req.body.idSpeech) {
                                    var comment = {
                                        text : req.body.comment,
                                        userName: req.body.userName
                                    };
                                    speech.comments.push(comment);
                                    var query_res = event.save();
                                    query_res.then(function(respuesta) {
                                        if(respuesta){
                                            res.status(200).jsonp(response.successfulResponse(labels.SUCC013, speech.comments));
                                        }else{
                                            res.status(400).jsonp(response.errorResponse(400,labels.ERRA003))
                                        }
                                    }).catch(function(err){
                                        res.status(500).jsonp(response.errorResponse(500,labels.ERRA015, err.message));
                                    });
                                    
                                }
                            });
                        }
                    });
                } else {
                    res.status(400).jsonp(response.errorResponse(400,labels.ERRA015));
                }
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA015, handler.message));
    }
};



exports.listCommentsOfSpeech = function(req, res) {
     console.log(req.params)
    try {
        if ((!response.isValidID(req.params.idEvent)) && (!response.isValidID(req.params.idSession)) && (!response.isValidID(req.params.idSpeech))){
            res.status(500).send(response.errorResponse(400,labels.ERRA005));
        } else {
            var query = Event.findById(req.params.idEvent).exec();
            query.then(function(event){
                if(event) {
                    event.sessions.forEach(function(session) {
                        if(session._id.toString() == req.params.idSession) {
                            session.speechs.forEach(function(speech){
                                if(speech._id.toString() == req.params.idSpeech) {
                                    res.status(200).jsonp(response.successfulResponse(labels.SUCC013, speech.comments));  
                                }
                            });
                        }
                    });
                } else {
                    res.status(400).jsonp(response.errorResponse(400,labels.ERRA015));
                }
            });
        }
    } catch (handler) {
        res.status(500).send(response.errorResponse(500,labels.ERRA015, handler.message));
    }
};