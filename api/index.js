import { createServer } from "http";
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import fetch from "node-fetch";
import fs from "fs/promises";

const httpServer = createServer();
const io = new SocketIOServer(httpServer);
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const apiUrl = "https://fdnd-agency.directus.app/items";

// Zorg dat werken met request data makkelijker wordt
app.use(express.json());

// Ignore favicon.ico request
app.get('/favicon.ico', (req, res) => {
  res.status(204);
});



let favourites = {};

app.get('/', async (request, response) => {
  try {
    console.log('favourites: ', favourites);
    const API = `${apiUrl}/tm_playlist`;
    const allPlaylistsResponse = await fetch(API);
    const playlists = await allPlaylistsResponse.json();

    // Recieve all liked playlists
    const liked_playlists = [];

    response.render('index2', {
      playlists: playlists.data || [],
      liked_playlists: liked_playlists || [],
    });
    
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});

// Like endpoint to store liked item IDs
app.post('/like', async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log('Item liked:', itemId);
   

    if (itemId) {
      if (itemId in favourites) {
        delete favourites[itemId];
      } else {
        favourites[itemId] = true;
      }
      res.json({ status: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Render playlists
app.get('/playlists', async (request, response) => {
  // try {
  //   const API =  `${apiUrl}/tm_playlist`;
  //   const [data] = await Promise.all([
  //     fetch(API).then(res => res.json()),
  //   ]);
  //   response.render('playlists', {
  //     playlist: dataFinal.data,
  //   });
  // } catch (error) {
  //   console.error(error);
  //   response.status(500).send("Internal Server Error");
  // }
});

// Render playlist based on slug
app.get('/:slug', async (request, response) => {
  // try {
  //   const API = `${apiUrl}/tm_playlist?filter={"slug":"${request.params.slug}"}&fields=title,description,slug,stories.tm_story_id.title,stories.tm_story_id.summary,stories.tm_story_id.image,stories.tm_story_id.slug,language_id.language,language_id.flag.id`;
  //   const [data] = await Promise.all([
  //     fetch(API).then(res => res.json()),
  //   ]);
  //   response.render('playlist', {
  //     playlist: dataFinal.data[0],
  //     stories: dataFinal.data[0].stories || [],
  //     language: dataFinal.data[0].language_id || [],
  //   });
  // } catch (error) {
  //   console.error(error);
  //   response.status(500).send("Internal Server Error");
  // }
});

// Render story based on playlist and story slug
app.get('/:playlistSlug/:storySlug', async (request, response) => {
  // try {
  //   const API = `${apiUrl}/tm_story?filter={"slug":"${request.params.storySlug}"}&fields=title,description,slug,image,video,playlist.tm_playlist_id.title,playlist.tm_playlist_id.slug, playlist.tm_playlist_id.description,`;
  //   const [data] = await Promise.all([
  //     fetch(API).then(res => res.json()),
  //   ]);
  //   response.render('story', {
  //     story: dataFinal.data[0],
  //   });
  // } catch (error) {
  //   console.error(error);
  //   response.status(500).send("Internal Server Error");
  // }
});


// Handle server error
httpServer.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    const address = httpServer.address();
    if (address !== null && typeof address !== "string") {
      const currentPort = address.port;
      const newPort = currentPort + 1;
      console.error(`Address ${currentPort} already in use, retrying on port ${newPort} in a few seconds...`);
      setTimeout(() => {
        httpServer.listen(newPort);
      }, 1000);
    } else {
      console.error(`Unable to retrieve server.`);
    }
  }
});

// Export the app
module.exports = app;
