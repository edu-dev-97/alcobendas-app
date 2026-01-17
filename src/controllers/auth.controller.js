const supabase = require('../config/supabase.js');

const loginAdmin = async (req, res) => {
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

module.exports = loginAdmin;