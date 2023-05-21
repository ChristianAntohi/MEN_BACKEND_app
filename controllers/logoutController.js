const User =  require('../model/User');




const handleLogout = async (req, res) => {
    // On the client, also delete accessToken
    const { refreshToken } = req.body;
  
    if (!refreshToken) return res.sendStatus(204); // No content
  
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      return res.sendStatus(204);
    }
  
    // Clear all refresh tokens from the user
    foundUser.refreshToken = [];
    const result = await foundUser.save();
  
    res.sendStatus(204);
  }

module.exports = { handleLogout };