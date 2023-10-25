const bcrypt = require('bcrypt')
const User = require('../model/User')

const getAllUsers = async (req, res) => {
  const users = await User.find()
  if (!users) return res.status(204).json({ message: 'No users found' })
  res.json(users)
}

const deleteUser = async (req, res) => {
  const userId = req.userId
  const { id, currentPassword } = req.body
  const userRole = req.roles

  const requestingUser = await User.findById(userId)
  const currentPasswordHash = requestingUser.password

  if (!id) {
    return res.status(400).json({ message: 'User ID required' })
  }

  if (userRole === 2) {
    // Admin can delete any user by ID
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' })
    }

    const user = await User.findOne({ _id: id }).exec()

    if (!user) {
      return res.status(204).json({ message: `User ID ${id} not found` })
    }

    const result = await User.deleteOne({ _id: id })

    res.json(result)
  } else if (requestingUser._id.toString() === id) {
    // User can delete their own account
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' })
    }
    const result = await User.deleteOne({ _id: id })

    res.json(result)
  } else {
    return res.status(403).json({ message: 'Unauthorized to delete the user' })
  }
}

const getUser = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: 'User ID required' })
  const user = await User.findOne({ _id: req.params.id }).exec()
  if (!user) {
    return res.status(204).json({ message: `User ID ${req.params.id} not found` })
  }
  res.json(user)
}

const updateUser = async (req, res) => {
  const { currentPassword, newPassword, role, user, id } = req.body
  const userId = req.userId
  const userRole = req.roles
  const userName = req.user
  console.log(userId, currentPassword, newPassword)

  const requestingUser = await User.findById(userId)
  const currentPasswordHash = requestingUser.password

  if (!requestingUser) {
    return res.status(204).json({ message: `User ID ${userId} not found` })
  }

  if (userRole === 2 && id) {
    // Admin can change any user's details by ID
    const userToUpdate = await User.findById(id)
    if (!userToUpdate) {
      return res.status(204).json({ message: `User ID ${id} not found` })
    }

    if (typeof user !== 'undefined' && user !== '') {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Invalid current password' })
      }
      // check for duplicate usernames in the db
      const duplicate = await User.findOne({ username: user }).exec()
      if (duplicate) return res.status(409).json({ message: 'Username already taken' }) // Conflict

      userToUpdate.username = user
    }

    if (typeof newPassword !== 'undefined' && newPassword !== '') {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Invalid current password' })
      }
      if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'New password should be different from the old password' })
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10)
      userToUpdate.password = newHashedPassword
    }

    if (typeof role !== 'undefined' && !isNaN(parseInt(role))) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Invalid current password' })
      }

      userToUpdate.roles = parseInt(role)
    }

    await userToUpdate.save()

    return res.status(200).json({ message: `Admin ${userName} changed User ${id} details successfully` })
  } else if (requestingUser._id.toString() === id) {
    // User can change their own details
    if (typeof user !== 'undefined' && user !== '') {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Invalid current password' })
      }
      // check for duplicate usernames in the db
      const duplicate = await User.findOne({ username: user }).exec()
      if (duplicate) return res.status(409).json({ message: 'Username already taken' }) // Conflict

      requestingUser.username = user
    }

    if (typeof newPassword !== 'undefined' && newPassword !== '') {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Invalid current password' })
      }
      if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'New password should be different from the old password' })
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10)
      requestingUser.password = newHashedPassword
    }

    if (typeof role !== 'undefined' && !isNaN(parseInt(role))) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Invalid current password' })
      }

      requestingUser.roles = parseInt(role)
    }

    await requestingUser.save()

    return res.status(200).json({ message: `User ${id} details updated successfully` })
  } else {
    return res.status(403).json({ message: 'Unauthorized to update the user' })
  }
}

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUser
}
