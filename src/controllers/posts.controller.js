//llamada a la conexion de la base de datos
const supabase = require('../config/supabase.js');

const getPublicPosts = async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('publicado', true)
    .order('fecha_publicacion', { ascending: false })

  if (error) return res.status(400).json(error)
  res.json(data)
}

const createPost = async (req, res) => {
  const { titulo, contenido, deporte, imagen_url, fecha_publicacion } = req.body

  const { data, error } = await supabase.from('posts').insert([{
    titulo,
    contenido,
    deporte,
    imagen_url,
    fecha_publicacion
  }])

  if (error) return res.status(400).json(error)
  res.json(data)
}

const updatePost = async (req, res) => {
  const { id } = req.params
  const body = req.body

  const { data, error } = await supabase
    .from('posts')
    .update(body)
    .eq('id', id)

  if (error) return res.status(400).json(error)
  res.json(data)
}

const deletePost = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json(error)
  res.json({ success: true })
}

module.exports = {
    getPublicPosts,
    createPost,
    updatePost,
    deletePost
}