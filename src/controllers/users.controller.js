const supabase = require('../config/supabase.js');

const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return res.status(400).json(error);
    }

    res.json(data.users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

module.exports = getUsers;