process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const { expect } = chai;
const { connection } = require("../db/connection");
chai.use(require("chai-sorted"));

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
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
            expect(body.user).to.contain.keys([
              "username",
              "avatar_url",
              "name"
            ]);
            expect(body.user.username).to.equal("rogersop");
          });
      });
      it("status:404 responds with an error message when trying to get a user with an username that does not exist", () => {
        return request(app)
          .get("/api/users/qwertyuiop")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("User not found");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("status:200 responds with all the articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(
              body.articles.every(article => {
                return expect(article).to.contain.keys([
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                ]);
              })
            ).to.be.true;
          });
      });
      // it("status:200 responds with the article object when given the article ID", () => {
      //   return request(app)
      //     .get("/api/articles/1")
      //     .expect(200)
      //     .then(({ body }) => {
      //       expect(body.article).to.be.an("object");
      //     });
      // });
      // it("status:200 responds with the correct keys in the article object", () => {
      //   return request(app)
      //     .get("/api/articles/1")
      //     .expect(200)
      //     .then(({ body }) => {
      //       expect(body.article).to.contain.keys([
      //         "article_id",
      //         "title",
      //         "body",
      //         "votes",
      //         "topic",
      //         "author",
      //         "created_at",
      //         "comment_count"
      //       ]);
      //       expect(body.article.article_id).to.equal(1);
      //     });
      // });
      // it("status:404 responds with an error message when trying to get an article with an ID that does not exist", () => {
      //   return request(app)
      //     .get("/api/articles/9999999")
      //     .expect(404)
      //     .then(({ body }) => {
      //       expect(body.msg).to.equal("Article not found");
      //     });
      // });
    });
    describe("PATCH", () => {
      it("status:202 should update an article's votes given the ID and respond with the updated article (increasing votes)", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({
            inc_votes: 10
          })
          .expect(202)
          .then(({ body }) => {
            expect(body.article[0].article_id).to.equal(4);
            expect(body.article[0].votes).to.equal(10);
          });
      });
      it("status:202 should update an article's votes given the ID and respond with the updated article(decreasing votes)", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({
            inc_votes: -100
          })
          .expect(202)
          .then(({ body }) => {
            expect(body.article[0].article_id).to.equal(4);
            expect(body.article[0].votes).to.equal(-100);
          });
      });
      it("status:404 responds with an error message when trying to update with an ID that does not exist", () => {
        return request(app)
          .patch("/api/articles/9999")
          .send({
            inc_votes: 10
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article not found");
          });
      });
      it("status:400 responds with an error message when trying to update with an empty body", () => {
        return request(app)
          .patch("/api/articles/4")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("status:400 responds with an error message when trying to update property with the incorrect datatype", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({ inc_votes: "ten" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("status:400 responds with an error message when trying to update property with a column name that does not exist", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({ vetos: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
    });
  });
});
