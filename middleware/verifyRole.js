

const verifyRole = (allowedRole) => {
    return (req, res, next) => {
      console.log('received info about role from decoded JWT:', req.roles);
      const userRole = req?.roles;
      console.log('value of userRole', userRole);
      if (!userRole || !allowedRole.includes(userRole)) {
        return res.sendStatus(401);
      }
      next();
    }
  }
  
  module.exports = verifyRole;