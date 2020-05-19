exports.unAuthorised = (req, res, next) => {
  res.status(401).json("Request not authorised to provide response!");
};

exports.onError = (res, msg = "Something went wrong") => {
  //503 - service un available
  res.json(`Error: ${msg}`);
};

exports.onInvalidEndpoint = (res) => {
  res.json("Please use valid endpoints to access resourcse!");
};
