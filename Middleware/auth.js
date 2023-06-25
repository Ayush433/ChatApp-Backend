const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Authorization header missing");
    }
    const decodedToken = jwt.verify(token.split(" ")[1], "tokenGenerated");
    console.log(decodedToken);
    req.user = {
      id: decodedToken.id,
    };
    next();
  } catch (err) {
    console.log("err:", err);
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }
};

module.exports = auth;
