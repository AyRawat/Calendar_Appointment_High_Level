let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);
let server = require("../index");

describe("Events", () => {
  describe("/GET slots", () => {
    it("it should get all the available slots for the day", (done, date = "2023-02-01", timezone = "Asia/Calcutta") => {
      chai
        .request(server.listen())
        .get(`/api/slots?date=${date}&timezone=${timezone}`)
        .end((err, res) => {
          if(err){console.log(err);}
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
});

describe("CreateEvent", () => {
  it("it should create an event and book the slot if it is possible", (done) => {
    let event = {
      startTime: "2023-02-07T12:30:00",
      slot: "60",
      date: "2023-02-07",
      name: "Sixth Feb",
      email: "sixth@feb.com",
    };
    chai
      .request(server)
      .post("/api/createEvent")
      .send(event)
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });
  it("it should not create an event if the slot is not available", (done) => {
    let event = {
      startTime: "2023-02-05T11:30:00",
      slot: "60",
      date: "2023-02-05",
      name: "xavier",
      email: "xavier23@gmail.com",
    };
    chai
      .request(server)
      .post("/api/createEvent")
      .send(event)
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        res.should.have.status(422);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        done();
      });
  });
});

describe("GetEventsInBetween", () => {
  it("it should Get all the events between two dates", (done) => {
          const startDate = "2023-01-31";
          const endDate = "2023-02-07";
          chai.request(server).get(`/api/getEvents?startDate=${startDate}&endDate=${endDate}`).end((err,res)=>{
            if(err)console.log(err);
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          })
  });
});
