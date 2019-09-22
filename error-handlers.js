exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err);
  } else next(err);
};

exports.sqlErrorHandler = (err, req, res, next) => {
  console.log(err.code);
  const errorCode = ["42703", "23502", "22P02"];
  if (errorCode.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (["23503"].includes(err.code)) {
    res.status(422).send({ msg: "Unprocessable Entity" });
  } else if (["2201X"].includes(err.code)) {
    res.status(400).send({ msg: "The page must be a positive integer" });
  } else if (["2201W"].includes(err.code)) {
    res.status(400).send({ msg: "The limit must be a positive integer" });
  } else next(err);
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.internalServerErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
};
