const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    winston = require("winston");
    

//Configure winston to log to file
const logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({handleExceptions: true,timestamp:true}),
        new winston.transports.File({ filename: "logs/output.log" })
    ],
    exitOnError: false
});


// Declare port variable to use value of port env variable of the system if available otherwise use 3000
const port = process.env.PORT || 3000;

//Import files
const controller = require("./controllers/");


// Middleware to parse body
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.post("/login",controller.controlls.webtokenfunc); // Login Api
app.post("/patch",controller.authmiddleware,controller.controlls.jsonpatchfunc); // apply jason patch api
app.post("/imageresize",controller.authmiddleware,controller.controlls.imageresizefunc); // Download and resize image api

// Server initialization
var server = app.listen(port,()=> {
    logger.info("The Server Has Started!");
});

module.exports = server;