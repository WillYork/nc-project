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
      it("status:200 responds with all the articles when article ID is not specified", () => {
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
      it("status:200 responds with the article object when given the article ID", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.be.an("object");
          });
      });
      it("status:200 responds with the correct keys in the article object when given the article ID", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.contain.keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            ]);
            expect(body.article.article_id).to.equal(1);
          });
      });
      it("status:404 responds with an error message when trying to get an article with an ID that does not exist", () => {
        return request(app)
          .get("/api/articles/9999999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article not found");
          });
      });
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
    describe("/:article_id/comments", () => {
      describe("POST", () => {
        it("status:201 responds with the comment posted", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({
              username: "rogersop",
              body: "this here is a comment"
            })
            .expect(201)
            .then(res => {
              expect(res.body.comment).to.contain.keys([
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              ]);
            });
        });
        it("status:400 responds with an error message when trying to post a comment using an article ID that does not exist", () => {
          return request(app)
            .post("/api/articles/9999/comments")
            .send({
              username: "rogersop",
              body: "this here is a comment"
            })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Not found");
            });
        });
        it("status:400 responds with an error message when trying to post a comment with an empty body", () => {
          return request(app)
            .post("/api/articles/4/comments")
            .send({
              username: "rogersop"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("status:400 responds with an error message when trying to post a comment using a non-existant column name", () => {
          return request(app)
            .post("/api/articles/4/comments")
            .send({
              username: "rogersop",
              bobby: "this is not going to post"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
      });
      describe("GET", () => {
        it("status:200 responds with an array of comment objects given the article ID", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.an("array");
            });
        });
        it("status:200 responds with an array of comment objects containg the correct keys given the article ID", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body }) => {
              expect(
                body.every(comment => {
                  return expect(comment).to.contain.keys([
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  ]);
                })
              ).to.be.true;
            });
        });
        it("status:200 defaults to being sorted by created_at", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.sortedBy("created_at");
            });
        });
        it("status:200 takes a sort by query and sorts the comments (ascending by default)", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.sortedBy("votes");
            });
        });
        it("status:200 should sort the array in descending order if instructed to", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&&order_by=desc")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.descendingBy("votes");
            });
        });
        it("status:200 ignores an invalid 'order by' instruction", () => {
          return request(app)
            .get("/api/articles/1/comments?order_by=none")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.be.sortedBy("created_at");
            });
        });
        it("status:404 responds with an error message when trying to get comments using an article ID that does not exist", () => {
          return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article not found");
            });
        });
        it("status:400 for invalid column to sort by", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=colours")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
      });
    });
  });
});
