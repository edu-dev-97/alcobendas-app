import { supabase } from '../config/supabase.js'

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return res.status(401).json(error)
  }

  res.json(data)
}