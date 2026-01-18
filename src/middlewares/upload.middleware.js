const multer = require('multer')

// Guardar archivo en memoria (ideal para subir luego a Supabase)
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Solo se permiten imágenes'), false)
    }
    cb(null, true)
  }
})

module.exports = upload