//llamada a la conexion de la base de datos
const supabase = require('../config/supabase.js');
const sharp = require('sharp'); //Necesario para convertir el buffer

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
  try {
    const file = req.file // viene de multer

    if (!file) {
        console.log('No se ha proporcionado ninguna imagen');
        return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen.' });
    }

    const imagenNombrePost = file.originalname;

    const { data: existente, error: existingError } = await supabase
        .storage
        .from('imagen-post')
        .list('', { search: imagenNombrePost });
    
    if (existingError) {
        console.error('Error al verificar existencia de imagen:', existingError.message);
        return res.status(500).json({ message: 'Error al verificar la existencia de la imagen en Supabase.' });
    }

    if (existente.length > 0) {
        console.log('La imagen ya existe en Supabase');
        return res.status(400).json({ message: 'Esta imagen ya está registrada en la base de datos. Por favor, cargue una imagen con otro nombre.' });
    }

    const buffer = await sharp(file.buffer).toBuffer();
    const { error: uploadError } = await supabase
        .storage
        .from('imagen-post')
        .upload(imagenNombrePost, buffer, {
            contentType: file.mimetype,
            upsert: false
        });
    
    if (uploadError) {
        console.error('Error al subir la imagen a Supabase:', uploadError.message);
        return res.status(500).json({ message: 'Error al subir la imagen a Supabase.' });
    }

    const urlPublica = `${process.env.SUPABASE_URL}/storage/v1/object/public/imagen-post/${imagenNombrePost}`;

    const { titulo, contenido, deporte, fecha_publicacion, mes_publicacion, ano_publicacion, instagram_url } = req.body;

    if (!titulo || !contenido || !deporte || !fecha_publicacion || !mes_publicacion || !ano_publicacion || !instagram_url) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        titulo,
        contenido,
        deporte,
        imagen_url: urlPublica,
        nombre_imagen: imagenNombrePost,
        fecha_publicacion,
        mes_publicacion,
        ano_publicacion,
        instagram_url
      }])
      .select()
      .single();

    if (error) return res.status(400).json(error)
    res.json(data)

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al crear post' });
  }
}

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, deporte, fecha_publicacion, mes_publicacion, ano_publicacion, instagram_url } = req.body;
    const file = req.file;
    
    if (!titulo || !contenido || !deporte || !fecha_publicacion || !mes_publicacion || !ano_publicacion || !instagram_url) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    //obtener post actual
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

    if (error || !data) {
      return res.status(400).json({ error: 'El post no existe' });
    }

    const oldImageUrl = data.imagen_url;
    const oldImageName = data.nombre_imagen;

    let nuevaUrl = oldImageUrl;
    let nuevoNombreImagen = oldImageName;

    if (file) {
      const imagenNombrePost = file.originalname;

      const { data: existente } = await supabase
        .storage
        .from('imagen-post')
        .list('', { search: imagenNombrePost });

      if (existente.length > 0) {
        return res.status(400).json({ message: 'Esta imagen ya está registrada en la base de datos. Por favor, cargue una imagen con otro nombre.' });
      }

      const buffer = await sharp(file.buffer).toBuffer();
      const { error: uploadError } = await supabase
        .storage
        .from('imagen-post')
        .upload(imagenNombrePost, buffer, {
            contentType: file.mimetype,
            upsert: false
        });

      if (uploadError) {
        console.error('Error al subir la imagen a Supabase:', uploadError);
        return res.status(500).json({ message: 'Error al subir la imagen a Supabase' });
      }

      nuevaUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/imagen-post/${imagenNombrePost}`;
      nuevoNombreImagen = imagenNombrePost;

      if (oldImageName) {
        await supabase
          .storage
          .from('imagen-post')
          .remove([oldImageName]);
      }
    }

    const { error: errUpdate } = await supabase
      .from('posts')
      .update({
        titulo, 
        contenido, 
        deporte, 
        imagen_url: nuevaUrl, 
        nombre_imagen: nuevoNombreImagen, 
        fecha_publicacion, 
        mes_publicacion, 
        ano_publicacion,
        instagram_url
      })
      .eq('id', id);

    if (errUpdate) return res.status(400).json(errUpdate);

    return res.json({
      message: 'Post actualizado correctamente'
    });

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al actualizar el post' })
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener post
    const { data: post, error: errPost } = await supabase
      .from('posts')
      .select('nombre_imagen')
      .eq('id', id)
      .single();

    if (errPost || !post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Eliminar imagen del storage
    if (post?.nombre_imagen) {
      const { error } = await supabase.storage
        .from('imagen-post')
        .remove([post.nombre_imagen]);

      if (error) {
        console.error('Error eliminando imagen:', error);
      }
    }

    // Eliminar post
    const { error: errDelete } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (errDelete) {
      return res.status(400).json(errDelete);
    }

    return res.json({ message: 'Post eliminado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el post' });
  }
};

module.exports = {
    getPublicPosts,
    createPost,
    updatePost,
    deletePost
}