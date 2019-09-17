process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const { expect } = chai;
const { connection } = require("../db/connection");
chai.use(require("chai-sorted"));

describe("/api", () => {
  after(() => {
    return connection.destroy();
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("status:200 reponds with all the topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
          });
      });
      it("status:200 responds with the correct keys in each topic", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(
              body.topics.every(treasure => {
                return expect(treasure).to.contain.keys([
                  "slug",
                  "description"
                ]);
              })
            ).to.be.true;
          });
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      it("status:200 responds with the user object when given the username", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.be.an("object");
          });
      });
      it("status:200 responds with the correct keys in the user object", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.contain.keys(['username', 'avatar_url', 'name']);
          });
      });
      it('status:404 responds with an error message explaining that the user was not found', () => {
        return request(app).get("/api/users/qwertyuiop").expect(404).then(({body}) => {
          expect(body.msg).to.equal("User not found")
        })
      });
    });
  });
});
