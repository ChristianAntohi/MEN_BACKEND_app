const bcrypt = require('bcrypt');
const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

const createUser = async (req, res) => {
    const { username, password, roles } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username, password and roles are required' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const user = await User.create({
        username,
        password: hashedPassword,
        roles,
      });
  
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

const updateUser = async (req, res) => {
    const { id, username, password, roles } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!id) {
        return res.status(400).json({ "message": 'User ID is required' });
    }
    const user = await User.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${id} not found` });
    }
    if (username) user.username = username;
    if (password) user.password = hashedPassword;
    if (roles) user.roles = roles;
    await user.save();
    res.json(user);
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
}