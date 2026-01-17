const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//rutas
const authRoutes = require('./routes/auth.routes.js');
const postsRoutes = require('./routes/posts.routes.js');
//
require('dotenv').config();

const app = express();

app.use(cors());

//Middleware general
app.use(express.json());
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' })); // Middleware para parsear JSON en el body de las peticiones

//Rutas de los endpoints
/*app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);*/
app.use(
    authRoutes,
    postsRoutes
);

//exportar app
module.exports = app