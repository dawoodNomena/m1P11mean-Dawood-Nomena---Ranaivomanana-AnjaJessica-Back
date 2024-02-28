
const check_role = (roleArray) => (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Session expirée",
        code: "SESSION_EXPIRED",
      });
    }
    var authorized = false;
    //if user has a role that is required to access any API
    try {
      roleArray.forEach((role) => {
        authorized = req.user.role === role;
      });
      if (authorized) {
        return next();
      }
    } catch (excep) {
      console.log(excep);
    }
    return res.status(401).json({
      success: false,
      message: "Vous n'avez pas le rôle correspendant",
    });
  };

  module.exports =  check_role;
  