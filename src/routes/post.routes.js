const express = require('express');
//variable router para utilizar la solicitud http (GET/POST/PUT/DELETE) en express
const router = express.Router();
const {getPublicPosts, createPost, updatePost, deletePost} = require('../controllers/posts.controller.js');
const verifyAdmin = require('../middlewares/auth.middleware.js');


router.get('/log/administrador/obtenerPost', getPublicPosts)
router.post('/log/administrador/crearPost', verifyAdmin, createPost)
router.put('/log/administrador/actualizarPost/:id', verifyAdmin, updatePost)
router.delete('/log/administrador/eliminarPost/:id', verifyAdmin, deletePost)

module.exports = router;