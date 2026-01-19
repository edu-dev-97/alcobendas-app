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

const getMe = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json(error);
  }

  res.json(data.user);
};

module.exports = { loginAdmin, getMe };