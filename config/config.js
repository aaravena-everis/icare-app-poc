var config = {};
config.web = {};

config.dbOptions = {
    db: { native_parser: true },
    server: {
        poolSize: 10,
        reconnectTries: Number.MAX_VALUE,
        //ssl: true
    },
    user: 'icappmongo',
    pass: '58Ozdus3NFfPf5pky1PF5LpINEsz2oBTHiPXq28QRRIzUIQf2h00VZfwK3Zwf17mwIIWWWOmonG6BSiCUUd2sQ=='
    //user: 'icare-dev',
    //pass: 'icare-dev'
};
//DEV
//config.dbEndpoint = 'mongodb://ds053218.mlab.com:53218/heroku_4m0g8nhg'; 

//TESTING
config.dbEndpoint = 'mongodb://icappmongo.documents.azure.com:10255/mobile_testing?ssl=true&replicaSet=globaldb';

//PRODUCCION
//config.dbEndpoint = 'mongodb://icappmongo.documents.azure.com:10255/mobileapp?ssl=true&replicaSet=globaldb';

config.web.port = process.env.PORT || 8080;
config.secret = 'BkBUltR453Cr3TP4sSW0Rd';
module.exports = config;