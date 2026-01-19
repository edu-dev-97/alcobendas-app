const express = require('express');
//variable router para utilizar la solicitud http (GET/POST/PUT/DELETE) en express
const router = express.Router();
const { loginAdmin, getMe } = require('../controllers/auth.controller.js');


router.post('/login', loginAdmin);
router.get('/idUser', getMe);

module.exports = router;