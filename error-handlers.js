exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err);
  } else next(err);
};

exports.sqlErrorHandler = (err, req, res, next) => {
  console.log(err.code);
  const errorCode = ["42703", "23502", "22P02", "23503"];
  if (errorCode.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};

exports.internalServerErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
};
