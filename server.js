//require('newrelic');
var compression = require('compression');
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var config         = require('./config/config');
var port           = config.web.port;

// Middlewares
var allowCrossDomain = function(req, res, next) {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 if ('OPTIONS' == req.method)res.sendStatus(200);else next();
};

app.use(compression());
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var api = express.Router();
api.get('/', function(req, res) {
 res.send('<html><body></body></html>');
});

app.use(api);

mongoose.connect(config.dbEndpoint, config.dbOptions).then(function(){
    console.log('Connected to Database');
}).catch(function(err){
    console.log(err);
});

// Import Models and Controllers
var models = require('./models');
var authorCtrl = require('./controllers/author');
var eventCtrl = require('./controllers/event');
var userCtrl = require('./controllers/user');
var streamCtrl = require('./controllers/stream-url');
var versionCtrl = require('./controllers/version');

// API routes
app.use('/api', api);
api.route('/author/:id').get(authorCtrl.getAuthor);
api.route('/addUser').post(userCtrl.add);
api.route('/user/:id').get(userCtrl.getUserCardShort);
api.route('/user/:id').put(userCtrl.update);
api.route('/addContact').post(userCtrl.addContact);
api.route('/listContacts/:idUser').get(userCtrl.listContacts);
api.route('/activeUsersList').get(userCtrl.listActiveUsers);
api.route('/userCard/:id').get(userCtrl.getUserCard);
api.route('/userShare/:idUser/:share').put(userCtrl.updateShareState);
api.route('/authentication').post(userCtrl.authentication);
api.route('/event').get(eventCtrl.getAllEvents);
api.route('/event-featured').get(eventCtrl.getFeaturedEvents);
api.route('/event-archived').get(eventCtrl.getArchiveEvents);
api.route('/event-today').get(eventCtrl.getTodayEvent);
api.route('/event/:id').get(eventCtrl.getEventDetail);
api.route('/comment/:idEvent/:idSession/:idSpeech').get(eventCtrl.listCommentsOfSpeech);
api.route('/comment/add').post(eventCtrl.addCommentToSpeech);
api.route('/evaluation/add').post(eventCtrl.addEvaluationToSpeech);
api.route('/inscription/add').post(eventCtrl.addInscription);
api.route('/url-stream').get(streamCtrl.getStreamUrl);
api.route('/version/:nombre').get(versionCtrl.getVersion);


// Start server
app.listen(port, function() {
 console.log("Node server running on port " + port);
});
