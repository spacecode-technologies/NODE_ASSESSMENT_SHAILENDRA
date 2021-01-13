var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

chai.should();

chai.use(chaiHttp);

describe("Users API", () => {
    /* Test the GET route */
    describe("GET /api/v1/getAllUser", () => {
        it("It should GET all the users", (done) => {
            chai.request(server)
                .get("/api/v1/getAllUser")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eq(5);
                done();
                });
        });
        it("It should NOT GET all the users", (done) => {
            chai.request(server)
                .get("/api/v1/getAllUser")
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                });
        });
    });

    /* Test the GET (by id) route */
    describe("GET /api/v1/getById/:id", () => {
        it("It should GET user by ID", (done) => {
            const userId = '5ffc3b509806a511887667d0';
            chai.request(server)
                .get("/api/v1/getById/"+userId)
                .end((err, response) => {
                    response.should.have.status(200);
                   response.body.should.be.a('object');
                   response.body.should.have.property('first_name');
                   response.body.should.have.property('lasr_name');
                   response.body.should.have.property('email');
                   response.body.should.have.property('phone_number');
                   response.body.should.have.property('_id').eq('5ffc3b509806a511887667d0')
                done();
                });
        });
        it("It should NOT GET user by ID", (done) => {
            const userId = 123;
            chai.request(server)
                .get("/api/v1/getById/"+userId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq("No user found.");
                done();
                });
        });
    });
    /* Test the POST route */
    describe("POST /api/v1/addUser", () => {
        it("It should add a new user", (done) => {
            const user = {
                first_name: "aditya",
                last_name: "sen",
                email: "adityakumarsen@gmail.com",
                phone_number: "8990564321",
            }
            chai.request(server)
                .post("/api/v1/addUser").send(user)
                .end((err, response) => {
                    response.should.have.status(201);
                   response.body.should.be.a('object');
                   response.body.should.have.property('_id').eq(6);
                   response.body.should.have.property('first_name').eq("aditya");
                   response.body.should.have.property('lasr_name').eq("sen");
                   response.body.should.have.property('email').eq("adityakumarsen@gmail.com");
                   response.body.should.have.property('phone_number').eq("8990564321");
                done();
                });
        });

        it("It should NOT add a new user without the email property", (done) => {
            const user = {
                first_name: "aditya",
                last_name: "sen",
                phone_number: "8990564321",
            }
            chai.request(server)
                .post("/api/v1/addUser").send(user)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Required field can not be empty.");
                done();
                });
        });
    });

    /* Test the DELETE route */
    describe("DELETE /api/v1/deleteById/:id", () => {
        it("It should DELETE a user", (done) => {
            const userId = '5ffc3b509806a511887667d0';
            chai.request(server)
                .delete("/api/v1/deleteById/" + userId)
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });
        it("It should NOT DELETE a user that is not in the database", (done) => {
            const userId = 145;
            chai.request(server)
                .delete("/api/v1/deleteById/" + userId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq("No user found By Id.");
                done();
                });
        });
    });
});