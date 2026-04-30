import Post from '../models/Post.js'

// @route POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body

    const post = await Post.create({
      user: req.user._id,
      text,
      image
    })

    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
}

// @route GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
}

// @route PUT /api/posts/:id/like
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) return res.status(404).json({ msg: 'Post not found' })

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ msg: 'Already liked' })
    }

    post.likes.push(req.user._id)
    await post.save()

    res.json(post.likes)
  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
}

// @route POST /api/posts/:id/comment
export const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) return res.status(404).json({ msg: 'Post not found' })

    const newComment = {
      user: req.user._id,
      text: req.body.text
    }

    post.comments.push(newComment)
    await post.save()

    res.json(post.comments)
  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
}
