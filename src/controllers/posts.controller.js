import { supabase } from '../config/supabase.js'

export const getPublicPosts = async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json(error)
  res.json(data)
}

export const createPost = async (req, res) => {
  const { titulo, contenido, deporte, imagen_url } = req.body

  const { data, error } = await supabase.from('posts').insert([{
    titulo,
    contenido,
    deporte,
    imagen_url
  }])

  if (error) return res.status(400).json(error)
  res.json(data)
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const body = req.body

  const { data, error } = await supabase
    .from('posts')
    .update(body)
    .eq('id', id)

  if (error) return res.status(400).json(error)
  res.json(data)
}

export const deletePost = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json(error)
  res.json({ success: true })
}