import User from '../models/User.js'

// 🔹 Update Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    user.bio = req.body.bio || user.bio
    user.skills = req.body.skills || user.skills
    user.profilePic = req.body.profilePic || user.profilePic

    const updated = await user.save()

    res.json(updated)
  } catch (err) {
    res.status(500).json({ msg: 'Error updating profile' })
  }
}

// 🔹 Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers following', 'name email')

    if (!user) return res.status(404).json({ msg: 'User not found' })

    res.json(user)
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching profile' })
  }
}

// 🔹 Follow / Unfollow
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user._id)

    if (!userToFollow) {
      return res.status(404).json({ msg: 'User not found' })
    }

    // already following → unfollow
    if (currentUser.following.includes(userToFollow._id)) {
      currentUser.following.pull(userToFollow._id)
      userToFollow.followers.pull(currentUser._id)

      await currentUser.save()
      await userToFollow.save()

      return res.json({ msg: 'Unfollowed user' })
    }

    // follow
    currentUser.following.push(userToFollow._id)
    userToFollow.followers.push(currentUser._id)

    await currentUser.save()
    await userToFollow.save()

    res.json({ msg: 'User followed' })
  } catch (err) {
    res.status(500).json({ msg: 'Error following user' })
  }
}
