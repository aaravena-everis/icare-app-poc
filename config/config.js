var config = {};
config.web = {};

config.dbOptions = {
    db: { native_parser: true },
    server: {
        poolSize: 10,
        reconnectTries: Number.MAX_VALUE
    },
        //user: 'icare-dev',
        //pass: 'icare-dev'
    	user: 'usuario1',
        pass: 'clave1'
};

//config.dbEndpoint = 'mongodb://ds053218.mlab.com:53218/heroku_4m0g8nhg';
config.dbEndpoint = 'mongodb://13.90.142.201:27017/app_qa'; 
config.web.port = process.env.PORT || 8080;
config.secret = 'URsltltR453Cr3TP4sSW0Rd';
module.exports = config;