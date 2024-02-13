const jwt = require("jsonwebtoken");

 function check_token(req, res, next) {
    const token = req.header("auth-token");
    if (!token) return res.status(400).send({ error: "Accès refusé!, Pas de token" });
  
    try {
      const verified = jwt.verify(token, process.env.jwtSecret);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).send({ error: "auth failed, check auth-token222" });
    }
  };

  module.exports = check_token