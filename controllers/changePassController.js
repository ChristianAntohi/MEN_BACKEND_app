const bcrypt = require('bcrypt');
const User = require('../model/User');

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;
  
    // Retrieve the user's current password hash from the database
    const user = await User.findById(userId);
    const currentPasswordHash = user.password;
  
    // Verify that the current password provided by the client matches the stored hash
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' });
    }
  
    // Hash the new password and update the user's password hash in the database
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: newHashedPassword });
  
    res.status(200).json({ message: 'Password changed successfully' });
  };
  module.exports = changePassword;