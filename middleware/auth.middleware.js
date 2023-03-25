const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  console.log("You are in auth route Zone")
  const token = req.headers.authorization; // when bearer #token ==> req.headers.authrorization.split(" ")[1] ==> this will take 1st index where token is present(in 0th index bearer word is there, that's why!)
  if (token) {
    const decoded = jwt.verify(token, "masai");
    console.log(decoded);
    if (decoded) {
      req.body.userID = decoded.userID;
      next();
    } else {
      res.status(400).send({ msg: "please login first" });
    }
  }
};

module.exports = {
  auth
};
