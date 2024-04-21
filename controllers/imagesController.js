

export const getImages = async (req, res) => {
    
    res.download(`./uploads/${req.query.img}`, (error) => {
        if(error) {
          // Manejar errores, por ejemplo, si el archivo no se encuentra
          res.status(404).send('Image not Found');
        }
    });
    
};