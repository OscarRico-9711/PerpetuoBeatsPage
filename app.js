require('dotenv').config(); // Para las variables DELICADO
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Datos del cliente Spotify
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Obtener token de acceso de la API 
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('Token de acceso obtenido:', data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Error al obtener el token de acceso', err);
  }
);

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Archivos estáticos CSS, IMG ETC 
app.use(express.static(__dirname + '/public'));

// Ruta principal - RAIZ
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta de contacto
app.get('/contact', (req, res) => {
  res.render('contact');
});

// Ruta del artista
app.get('/spotify/57AW2Xl73JztY2BsJAUg9o', (req, res) => {
  const artistId = '57AW2Xl73JztY2BsJAUg9o'; // ID estático del artista

  // Obtener los álbumes del artista
  spotifyApi.getArtistAlbums(artistId, { limit: 30, market: 'US' }).then(
    function(albumData) {
      const albumPromises = albumData.body.items.map(album => {
        return spotifyApi.getAlbumTracks(album.id, { limit: 5, market: 'US' })
          .then(function(trackData) {
            return trackData.body.items.map(track => ({
              name: track.name,
              artist: track.artists[0].name,
              albumArt: album.images[0] ? album.images[0].url : '',
              albumName: album.name,
              previewUrl: track.preview_url, 
              trackid: track.id
            }));
          });
      });

      // Esperar a que todas las promesas se resuelvan
      Promise.all(albumPromises).then(trackLists => {
        const tracks = trackLists.flat(); // Combinar todas las listas de canciones en una sola lista
        res.render('spotify', { tracks });
      });
    },
    function(err) {
      console.log('Algo salió mal al obtener los álbumes del artista', err);
      res.status(500).send('Error al obtener los álbumes del artista');
    }
  );
});


// Ruta 404
app.use((req, res, next) => {
  res.status(404).render('404', {
    error: 'Error 404',
    description: 'Page not found'
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor activo en el puerto: ${port}`);
});
