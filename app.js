const express = require('express');
const app = express();
const port = 3000;

//MOTOR DE PLANTILLAS EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// //REFERENCIAR CARPETA GLOBAL - MIDDLEWORLD 
app.use(express.static(__dirname + '/public'))

//ROUTER PARA INDEX
app.get('/', (req, res) => {
  res.render('index');
})

app.use((req, res, next) => {
  res.status(404).render('404', {
    error: 'Error 404',
    descripcion: 'Pagina no encontrada '
  })
})


//ESCUCHA DEL SERVIDOR EXPRESS
app.listen(port, () => {
  console.log('Servidor activo en el puerto: ', port);
})

