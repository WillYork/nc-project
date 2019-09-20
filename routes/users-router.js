const usersRouter = require("express").Router();
const {
  getUserByUsername,
  postUser,
  getAllUsers
} = require("../controllers/users-controller");
const { send405Error } = require("../error-handlers");

usersRouter
  .route("/").get(getAllUsers)
  .post(postUser)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = { usersRouter };
