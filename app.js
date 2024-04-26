// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))

// API naar Directus
const apiUrl = "https://fdnd-agency.directus.app/items";

// Array voor favourieten
let favourites = ['1']
console.log('restarted')

app.get('/', async (request, response) => {
    console.log(favourites)
    // Haal alle 'normale' playlists op
    const API = `${apiUrl}/tm_playlist?fields=id,title,description,slug,image.*,image.*.*,image*.*.*,image.id,image.height,image.width,stories.tm_story_id.title,stories.tm_story_id.summary,stories.tm_story_id.image,stories.tm_story_id.slug,language_id.language,language_id.flag.id`;
    const allPlaylistsResponse = await fetch(API);
    const playlists = await allPlaylistsResponse.json();

    // Haal alle 'gelikede' playlists op
    const liked_playlists = [];

    // Rendert de home pagina met alle data
    response.render('index', {
      playlists: playlists.data || [],
      liked_playlists: liked_playlists || [],
      favourites: favourites || [],
    });
});

// POST function voor het liken van een playlist
app.post('/', async (req, res) => {
  try {

    console.log(favourites)
    // Ontvant het item id
    const itemId = req.body.itemId;
    console.log('Item liked:', itemId);

    // Bekijkt of het item al geliked is
    if (favourites.includes(itemId)) {
      // Verwijderd item uit liked items
      favourites = favourites.filter(item => item !== itemId);
    } else {
      // Voegt item toe aan liked items
      favourites.push(itemId);
    }


    console.log(favourites)
    // Haal alle 'normale' playlists op
    const API = `${apiUrl}/tm_playlist?fields=id,title,description,slug,image.*,image.*.*,image*.*.*,image.id,image.height,image.width,stories.tm_story_id.title,stories.tm_story_id.summary,stories.tm_story_id.image,stories.tm_story_id.slug,language_id.language,language_id.flag.id`;
    const allPlaylistsResponse = await fetch(API);
    const playlists = await allPlaylistsResponse.json();

    // Haal alle 'gelikede' playlists op
    const liked_playlists = [];

    // Rendert de home pagina met alle data
    res.render('index', {
      playlists: playlists.data || [],
      liked_playlists: liked_playlists || [],
      favourites: favourites || [],
    });

    // Zo niet, geef een error
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Renderd alle playlists
// app.get('/playlists', async (request, response) => {
//   // try {
//   //   const API =  `${apiUrl}/tm_playlist`;
//   //   const [data] = await Promise.all([
//   //     fetch(API).then(res => res.json()),
//   //   ]);
//   //   response.render('playlists', {
//   //     playlist: dataFinal.data,
//   //   });
//   // } catch (error) {
//   //   console.error(error);
//   //   response.status(500).send("Internal Server Error");
//   // }
// });

// // Renderd de playlist pagina via de slug
// app.get('/:slug', async (request, response) => {
//   // try {
//   //   const API = `${apiUrl}/tm_playlist?filter={"slug":"${request.params.slug}"}&fields=title,description,slug,stories.tm_story_id.title,stories.tm_story_id.summary,stories.tm_story_id.image,stories.tm_story_id.slug,language_id.language,language_id.flag.id`;
//   //   const [data] = await Promise.all([
//   //     fetch(API).then(res => res.json()),
//   //   ]);
//   //   response.render('playlist', {
//   //     playlist: dataFinal.data[0],
//   //     stories: dataFinal.data[0].stories || [],
//   //     language: dataFinal.data[0].language_id || [],
//   //   });
//   // } catch (error) {
//   //   console.error(error);
//   //   response.status(500).send("Internal Server Error");
//   // }
// });

// // Renderd de story pagina via de slug
// app.get('/:playlistSlug/:storySlug', async (request, response) => {
//   // try {
//   //   const API = `${apiUrl}/tm_story?filter={"slug":"${request.params.storySlug}"}&fields=title,description,slug,image,video,playlist.tm_playlist_id.title,playlist.tm_playlist_id.slug, playlist.tm_playlist_id.description,`;
//   //   const [data] = await Promise.all([
//   //     fetch(API).then(res => res.json()),
//   //   ]);
//   //   response.render('story', {
//   //     story: dataFinal.data[0],
//   //   });
//   // } catch (error) {
//   //   console.error(error);
//   //   response.status(500).send("Internal Server Error");
//   // }
// });


// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})