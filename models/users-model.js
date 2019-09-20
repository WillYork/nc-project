const { connection } = require("../db/connection");

exports.selectAllUsers = () => {
  return connection.select("*").from("users");
};

exports.selectUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .returning("*")
    .then(user => {
      if (user.length) return user;
      else return Promise.reject({ status: 404, msg: "User not found" });
    });
};

exports.insertUser = user => {
  return connection.insert(user, "*").into("users");
};
