const express = require('express');
const app = express();
const port = 3000;

//MOTOR DE PLANTILLAS EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// //REFERENCIAR CARPETA GLOBAL - MIDDLEWORLD - ACCEDER AL CSS E IMAGENES
app.use(express.static(__dirname + '/public'))

//ROUTER PARA INDEX
app.get('/', (req, res) => {
  res.render('index');
})

//ROUTER PARA INDEX
app.get('/contact/', (req, res) => {
  res.render('contact');
})

//ROUTER 404
app.use((req, res, next) => {
  res.status(404).render('404', {
    error: 'Error 404',
    description: 'Page not found'
  })
})



//ESCUCHA DEL SERVIDOR EXPRESS - IR AL FINAL
app.listen(port, () => {
  console.log('Servidor activo en el puerto: ', port);
})

