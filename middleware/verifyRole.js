const verifyRole = (allowedRole) => {
    return (req, res, next) => {
      const userRole = req?.roles;
      if (!userRole || !allowedRole.includes(userRole)) {
        return res.sendStatus(401);
      }
      next();
    }
  }
  
  module.exports = verifyRole;
  