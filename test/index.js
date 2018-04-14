const chai = require("chai"),
    chaiHttp = require("chai-http"),
    app = require("../app"),
    expect = chai.expect,
    jwt = require("jsonwebtoken"),
    secret = require("../controllers/secret.json").secret;

chai.use(chaiHttp);

describe("routes", () => {
    var token="";
    describe("Json web token test", () => {
        it("it should not POST without an id or a password", (done) => {
      	let userdata = {
      		username: "admin",
      		password: "admin"
      	    };
            chai.request(app)
                .post("/login")
                .set("content-type", "application/x-www-form-urlencoded")
                .send(userdata)
                .end((err, res) => {
            	token = res.body.token;
            	expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res).to.have.nested.property("body")
                        .that.includes.all.keys([ "success", "token"]);
                    jwt.verify(res.body.token,secret,(err, decoded)=>{
                	if(!err) done();
                    });
                });
        });
    });

    describe("Json patch test", () => {
        it("it should not POST without a json file or a json patch", (done) => {
            let jsondata = {
        	token : token,
                jsonfile: {"orders": [{"id": 123}, {"id": 456}]},
                jsonpatch:{ "op": "add", "path": "/orders/1", "value": {"id": 789} }
            };
            chai.request(app)
                .post("/patch")
                .set("content-type", "application/x-www-form-urlencoded")
                .send(jsondata)
                .end((err, res) => {
            	if(!err){
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                    } else {
                        expect(err).to.be.json;
                        expect(res).to.have.nested.property("body")
                            .that.includes.all.keys([ "success", "message"]);
                    }
                    done();
                });
        });
    });

    describe("Image post Test", () => {
        it("it should not POST without an image url", (done) => {
            let imagedata = {
        	token : token,
                imageurl: "https://www.popsci.com/sites/popsci.com/files/styles/1000_1x_/public/images/2017/10/00-iphone-x.jpg?itok=PFv70hwN&fc=50,50"
            };
            chai.request(app)
                .post("/imageresize")
                .set("content-type", "application/x-www-form-urlencoded")
                .send(imagedata)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.html;
                    done();
                });
        }).timeout(8000);
    });
});