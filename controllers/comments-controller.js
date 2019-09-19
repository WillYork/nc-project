const {
  updateComment,
  updateCommentVotes,
  removeComment
} = require("../models/comments-model");

exports.patchComment = (req, res, next) => {
  const comment_id = req.params;
  let newProp = req.body;
  if (Object.keys(newProp).length === 0) newProp = { key: "value" };
  if (Object.keys(newProp)[0] === "inc_votes") {
    updateCommentVotes(comment_id, newProp)
      .then(comment => {
        res.status(200).send({ comment });
      })
      .catch(next);
  } else
    updateComment(comment_id, newProp)
      .then(comment => {
        res.status(200).send({ comment });
      })
      .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
