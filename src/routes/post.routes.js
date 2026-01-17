import { Router } from 'express'
import {
  getPublicPosts,
  createPost,
  updatePost,
  deletePost
} from '../controllers/posts.controller.js'
import { verifyAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', getPublicPosts)
router.post('/', verifyAdmin, createPost)
router.put('/:id', verifyAdmin, updatePost)
router.delete('/:id', verifyAdmin, deletePost)

export default router