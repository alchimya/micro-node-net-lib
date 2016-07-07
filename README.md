# micro-node-net-lib
An utility library that helps to manage the life cycle of a Node.Js server instance.

# What is this?
Developing a NodeJs Microservices Architecture, most of the time, you need to do some "boring" operations.
<br/>
This library will help you with the server setup operations like create an instance and listen to the exit events.
<br/>
Thi library is ready to use with http and https server and it is fully integrated with express.

# How to use

Very easy to use!
```javascript
    var config={
        server:{
            port:8080
        }
    };
    
    var server = require ('micro-node-net-lib').server(config);
    
    server.create(function (err,server) {
        if (err){
            console.log(err);
        }else {
            console.log("Server is listening");
        }
    });
    
    server.registerExitHandler(function () {
        process.exit();
    });
```
Where the config object hase the following structure:
```javascript
 "config"={
    "server":{
        "port":"port_number",
        "host":"string_host"
    },
    "https":{
        "isEnabled":"true/false"
        "key":"file_content_string",
        "ca":"file_content_string"
    },
    "express":{
        "app":"express_app_instance"
    }
 }
```
- server.port: is the port where you want to listen to
- server.host: is the host server (default localhost)
- https.isEnabled: true/false if you want to create an https server instance
- https.key & https.ca: you https server certificates
- express.app: is you are using Express.Js you can put here your Express() app instance

# HTTP Example
```javascript
    var config={
        server:{
            port:8080
        }
    };
    
    var server = require ('micro-node-net-lib').server(config);
    
    server.create(function (err,server) {
        if (err){
            console.log(err);
        }else {
            console.log("Server is listening");
        }
    });
    
    server.registerExitHandler(function () {
        process.exit();
    });
```
# HTTP Cluster Example
```javascript
var cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    config={
        server:{
            port:8080
        }
    };

    if (cluster.isMaster) {
    
        console.log("cpus:" + numCPUs);
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('exit', function(worker, code, signal) {
            debug('Worker %d died with code/signal %s. Restarting worker...',  worker.process.pid, signal || code);
            cluster.fork();
        });
    
    } else {
        var server = require ('micro-node-net-lib').server(config);
        server.create(function (err,server) {
            if (err){
                console.log(err);
            }else {
                console.log("Worker %d is listening.", cluster.worker.id);
            }
        });
        server.registerExitHandler(function () {
           //console.log("exit")
        });
    }
```

# HTTPS Example

```javascript
var fs = require('fs'),
    key_pem_file = "",//use your server file
    cert_pem_file = "",//use your server file
    config={
        server:{
            port:8080
        },
        https:{
            isEnabled:true,
            key:fs.readFileSync(__dirname  + "/" + key_pem_file ),
            ca:fs.readFileSync(__dirname  + "/" +cert_pem_file )
        }
    };

    var server = require ('micro-node-net-lib').server(config);
    
    
    server.create(function (err,server) {
        if (err){
            console.log(err);
        }else {
            console.log("Server is listening");
        }
    });
    
    server.registerExitHandler(function () {
        process.exit();
    });
```

# Express.JS Example
```javascript
var express=require('express'),
    bodyParser = require('body-parser'),
    config={
        server:{
            port:8080
        },
        express:{
            app:null
        }
    },
    app=express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    config.express.app = app;

    var server = require ('micro-node-net-lib').server(config);


    server.create(function (err,server) {
        if (err){
            console.log(err);
        }else {
            console.log("Server is listening");
        }
    });
    
    server.registerExitHandler(function () {
        process.exit();
    });
```
