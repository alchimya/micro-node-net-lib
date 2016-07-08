/**
 * Created by domenicovacchiano on 07/07/16.
 */
/*
 config={
    server:{
        port:port_number,
        host:string_host
    },
    https:{
        isEnabled:true/false
        key:"file_content_string",
        ca:"file_content_string"
    },
    express:{
        app:express_app_instance
    }
 }
 */

function Server(config) {
    return{
        create:function (callback) {

            var server = null;
            var app = null;
            var host = null;
            var isHttps = false;
            
            if (config.express && config.express.app){
                app = config.express.app;
            }
            if (config.https && config.https.isEnabled){
                isHttps = config.https.isEnabled;
            }
            if (config.server && config.server.host){
                host = config.server.host;
            }
            if (isHttps){
                var https = require('https'),
                credentials = {
                    key: config.https.key,
                    cert: config.https.ca
                };
                server = https.createServer(credentials, app).listen(config.server.port,config.server.host,function(){
                    callback(null,server);
                });
            }else {
                var http = require('http');
                server = http.createServer(app).listen(config.server.port,config.server.host,function(){
                    callback(null,server);
                });
            }
            server.on('error', function (error) {
                callback(error,null);
            });
        },
        registerExitHandler:function (f) {
            process.on('exit', f);
            process.on('SIGINT', f);
            process.on('SIGTERM', f);
            process.on('uncaughtException', f);
        }
    };
};

module.exports=Server;