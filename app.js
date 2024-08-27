require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express'); 
const app = express(); 
const port = process.env.PORT || 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Función para obtener y establecer el token de acceso de Spotify
async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant(); // Obtener el token de acceso
    spotifyApi.setAccessToken(data.body['access_token']); // Establecer el token de acceso para futuras solicitudes
    console.log('Token de acceso obtenido:', data.body['access_token']); 
  } catch (err) {
    console.log('Error al obtener el token de acceso', err);
  }
}

// OBTENER TOKEN NUEVO CADA HORA - EVITA CAIDAS
getAccessToken();
setInterval(getAccessToken, 3600 * 1000);


// Configuración para reintentar solicitudes fallidas a la API con un límite de reintentos y retraso
const MAX_RETRIES = 3; 
const RETRY_DELAY = 2000; 

async function fetchWithRetries(apiCall, retries = MAX_RETRIES) {
  try {
    return await apiCall(); // Intentar ejecutar la llamada a la API
  } catch (err) {
    if (retries === 0) throw err; // Lanzar error si se agotaron los reintentos
    console.log(`Error al obtener datos. Reintentando en ${RETRY_DELAY / 1000} segundos...`); // Mensaje de error y reintento
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); // Esperar antes de reintentar
    return fetchWithRetries(apiCall, retries - 1); // Reintentar la llamada a la API
  }
}

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Servir archivos estáticos como CSS, imágenes y JavaScript
app.use(express.static(__dirname + '/public'));

// Ruta principal - Renderizar la página de inicio
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta de contacto - Renderizar la página de contacto
app.get('/contact', (req, res) => {
  res.render('contact');
});

// Ruta para obtener información del artista y álbumes de Spotify
app.get('/spotify/57AW2Xl73JztY2BsJAUg9o', async (req, res) => {
  const artistId = '57AW2Xl73JztY2BsJAUg9o'; 

  try {
    // Obtener los álbumes del artista con reintentos
    const albumData = await fetchWithRetries(() => spotifyApi.getArtistAlbums(artistId, { limit: 30, market: 'US' }));
    
    // Obtener las pistas de cada álbum con reintentos
    const albumPromises = albumData.body.items.map(album => {
      return fetchWithRetries(() => spotifyApi.getAlbumTracks(album.id, { limit: 5, market: 'US' }))
        .then(trackData => trackData.body.items.map(track => ({
          name: track.name,
          artist: track.artists[0].name,
          albumArt: album.images[0] ? album.images[0].url : '',
          albumName: album.name,
          previewUrl: track.preview_url,
          trackid: track.id
        })));
    });

    const trackLists = await Promise.all(albumPromises); // Esperar a que todas las promesas se resuelvan
    const tracks = trackLists.flat(); // Combinar todas las listas de canciones en una sola lista
    res.render('spotify', { tracks }); // Renderizar la página de Spotify con los datos de las canciones
  } catch (err) {
    console.log('Algo salió mal al obtener los álbumes del artista', err); // Manejar errores al obtener los álbumes
    res.status(500).send('Error al obtener los álbumes del artista'); // Enviar un error 500 al cliente
  }
});

// Ruta para manejar errores 404 - Página no encontrada
app.use((req, res, next) => {
  res.status(404).render('404', {
    error: 'Error 404',
    description: 'Page not found'
  });
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor activo en el puerto: ${port}`);
});
