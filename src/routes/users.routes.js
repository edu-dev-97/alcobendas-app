const express = require('express');
//variable router para utilizar la solicitud http (GET/POST/PUT/DELETE) en express
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/users.controller.js');
const verifyAdmin = require('../middlewares/auth.middleware.js');

router.get('/log/administrador/usuarios', verifyAdmin, getUsers);
router.get('/log/administrador/usuarios/:id', verifyAdmin, getUserById);

module.exports = router;