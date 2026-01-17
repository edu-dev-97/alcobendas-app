const express = require('express');
//variable router para utilizar la solicitud http (GET/POST/PUT/DELETE) en express
const router = express.Router();
const {getPublicPosts, createPost, updatePost, deletePost} = require('../controllers/posts.controller.js');
const verifyAdmin = require('../middlewares/auth.middleware.js');


router.get('/', getPublicPosts)
router.post('/', verifyAdmin, createPost)
router.put('/:id', verifyAdmin, updatePost)
router.delete('/:id', verifyAdmin, deletePost)

module.exports = router;