const Jimp = require("jimp"),
    jwt = require("jsonwebtoken"),
    jsonpatch = require("json-patch"),
    winston = require("winston"),
    secret = require("./secret.json").secret;


const logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({handleExceptions: true,timestamp:true}),
        new winston.transports.File({ filename: "logs/output.log" })
    ],
    exitOnError: false
});

// variable to store all the users signing in
var users = [];

// Function to take image url and convert it to thumbnail of size 50 x 50
var jimpfunc = (url)=>{
    return new Promise((resolve)=> {
        Jimp.read(url)
            .then((img) => {
                img.resize(50,50)  // resize image
                    .getBase64(Jimp.AUTO,(err,image)=>{  // convert image to base64 image url
                        if(err) logger.error(err);
                        else resolve(image);
                    });
            })
            .catch((error) => logger.error("errorjimp :",error));
    });
};

// Export all Controller functions
module.exports.controlls = {
    webtokenfunc : (req,res) => {
        if(req.body.username && req.body.password){
    	let user = {
    		username : req.body.username,
    		password : req.body.password
    	   };
    	users.push(user);
    	let payload = user.username;
            jwt.sign(payload,secret, (err,token)=> {
          	if(err) logger.error("token creation : ",err);
        	else res.json({success: true,token : token});
            });	
    	}
        else {
    	res.status(401).json({success:false,message:"Username and password required"});
        } 
    },
    
    jsonpatchfunc : (req,res) =>{
    	try{
    		let doc = JSON.parse(req.body.jsonfile);
    	    let patchobj = JSON.parse(req.body.jsonpatch);
    	    let result = jsonpatch.apply(doc,patchobj);
            res.json(result);
        }catch(err){
    	    res.json({success:false,message : err});
        }    
    },

    imageresizefunc : (req,res) => {
    	jimpfunc(req.body.imageurl)
    	.then((image)=>res.send(`<img src="${image}">`));
    }
};

// Export Middleware
module.exports.authmiddleware = (req,res,next)=>{
    let token = req.body.token;
    if(token){
         	jwt.verify(token,secret,(err, decoded)=> {
            if(err) logger.error("token decode :", err);
            else next();
        });
    }
    else res.status(403).send("No webtoken present");
         
};