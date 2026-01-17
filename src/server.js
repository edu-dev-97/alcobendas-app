import app from './app.js'

//Crear la raíz de la API (una vez subido a vercel)
app.get('/', (req, res) => {
    res.send('API alcobendas funcionando correctamente');
})