const forms = document.querySelectorAll('form');

forms.forEach((form) => {
  form.addEventListener('submit', async (e) => {
    // Voorkomt dat de pagina ververst
    e.preventDefault();

    const formData = new FormData(form);

    // Haalt de id van de playlist op
    const itemId = formData.get('itemId');

    console.log('Submit check: ', itemId);

    // API URL
    const apiUrl = 'https://fdnd-agency.directus.app/items';
    const url = `${apiUrl}/tm_likes`;

    try {
      // Maakt een fetch request aan
      const response = await fetch(url, {
        method: form.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "playlist": itemId, "user": 4 }),
      });

      if (!response.ok) {
        // Geeft een error als het niet lukt
        throw new Error('Failed to update favorites');
      } else {
        console.log('Favorites updated successfully');
      }

      // Haalt de favorieten op
      // const { favorites } = await response.json();
      // Update de favorieten met de nieuwe data
      updateFavorites();
    } catch (error) {
      console.error(error);
      // Met error
    }
  });
});


function checkIfLiked(playlist, array) {
  // Bekijkt of de playlist in de array zit
  const isLiked = array.some(likedPlaylist => likedPlaylist.playlist === playlist.id);
  // Dubbel check of de playlist in de array zit
  console.log("isLiked for " + playlist.id + " is: " + isLiked);
  
  // Voegt een isLiked attribuut toe aan de playlist array
  return {
      ...playlist,
      isLiked: isLiked
  };
}
function updateFavorites() {
  // Fetch all playlists
  fetch(`https://fdnd-agency.directus.app/items/tm_playlist?fields=*.*.*.*`)
    .then(response => response.json())
    .then(playlistsData => {
      const playlists = playlistsData.data;

      // Fetch all liked playlists of the user
      return fetch(`https://fdnd-agency.directus.app/items/tm_likes?filter={"user":"4"}`)
        .then(response => response.json())
        .then(likedPlaylistsData => {
          const likedPlaylists = likedPlaylistsData.data;

          // Add the isLiked status to each playlist
          const playlistsWithLikedStatus = playlists.map(playlist => {
            return checkIfLiked(playlist, likedPlaylists);
          });

          // Filter only the liked playlists
          const likedPlaylistsOnly = playlistsWithLikedStatus.filter(playlist => playlist.isLiked);

          // Fetch the new HTML
          return fetch('/')
            .then(response => response.text())
            .then(updatedHtml => {
              // Update it with the new function
              if (document.startViewTransition) {
                document.startViewTransition(function() {
                  document.body.innerHTML = updatedHtml;
                });
              } else {
                document.body.innerHTML = updatedHtml;
              }
            });
        });
    })
    .catch(error => {
      console.error(error);
    });
}
