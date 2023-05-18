const User =  require('../model/User');
const jwt = require('jsonwebtoken');



const handleRefreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) return res.sendStatus(401);
    
    const foundUser = await User.findOne({ refreshToken }).exec();
  
    // Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.sendStatus(403); // Forbidden
          console.log('attempted refresh token reuse!');
          const hackedUser = await User.findOne({ username: decoded.username }).exec();
          hackedUser.refreshToken = [];
          const result = await hackedUser.save();
          console.log(result);
        }
      );
      return res.sendStatus(403); // Forbidden
    }
  
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);
  
    // Evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log('expired refresh token');
          foundUser.refreshToken = [...newRefreshTokenArray];
          const result = await foundUser.save();
          console.log(result);
        }
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
        // Refresh token was still valid
        const roles = foundUser.roles;
        const username = foundUser.username;
        const userId = foundUser._id;
        const accessToken = jwt.sign(
          { 
            "UserInfo":{    
              "username": username,
              "roles": roles
            }   
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '1d' }
        );
        console.log(roles);
        const newRefreshToken = jwt.sign(
          { "username": foundUser.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1d' }
        );
        // Saving refreshtoken with current user 
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        // Send role, accessToken, and refreshToken to the client side
        res.json({ roles, username, userId, accessToken, refreshToken: newRefreshToken });
      }
    );
  }

module.exports = { handleRefreshToken };