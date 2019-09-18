const { connection } = require("../db/connection");

exports.updateComment = (comment_id, newProp) => {
  return connection("comments")
    .where(comment_id)
    .update(newProp)
    .returning("*")
    .then(comment => {
      if (comment.length) return comment;
      else return Promise.reject({ status: 404, msg: "Comment not found" });
    });
};

exports.updateCommentVotes = (comment_id, { inc_votes }) => {
  return connection("comments")
    .where(comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      if (comment.length) return comment;
      else return Promise.reject({ status: 404, msg: "Comment not found" });
    });
};

exports.removeComment = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({ status: 404, msg: "Comment not found" });
    });
};
