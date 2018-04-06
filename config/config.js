var config = {};
config.web = {};

config.dbOptions = {
    db: { native_parser: true },
    server: {
        poolSize: 10,
        reconnectTries: Number.MAX_VALUE
    },
    user: 'icare-dev',
    pass: 'icare-dev'
};
config.dbEndpoint = 'mongodb://ds053218.mlab.com:53218/heroku_4m0g8nhg'; 
config.web.port = process.env.PORT || 8080;
config.secret = 'BkBUltR453Cr3TP4sSW0Rd';
module.exports = config;