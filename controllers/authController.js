const User =  require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Int32 } = require('mongodb');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res.status(400).json({ 'message': 'Username and password are required.' });
  }

  const foundUser = await User.findOne({ username: user }).exec();
  
  if (!foundUser) {
    return res.status(401).json({'message': 'Username or password are incorrect'});
  }

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const roles = foundUser.roles;

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "userId": foundUser._id.toString(),
          "username": foundUser.username,
          "roles": roles
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    const newRefreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    foundUser.refreshToken.push(newRefreshToken); // Store the new refresh token in the array
    const result = await foundUser.save();

    res.json({ roles, foundUser, newRefreshToken, accessToken });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { handleLogin };