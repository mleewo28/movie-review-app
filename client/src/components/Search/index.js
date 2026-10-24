import React, {useState} from 'react';
import {Typography, TextField, Button} from '@mui/material';
import searchPage from '../../assets/search_page.png';
import Box from '@mui/material/Box';


const Search = () => {

  const [searchTitle, setSearchTitle] = useState('')

  const [searchActor, setSearchActor] = useState('');

  const [searchDirector, setSearchDirector] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  // for showing error message such as "No movies found"
  const [searchMessage, setSearchMessage] = useState('');

  const handleSearch = async () => {

    // Clear an old message before starting a new search.
    setSearchMessage('');

    try {

      const response = await fetch('/api/searchMovies', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          title: searchTitle,
          actor: searchActor,
          director: searchDirector
        })
      });

     // If the server does not return a successful response,
      // create an error.
      if (!response.ok) {
        throw new Error('Unable to search for movies.');
      }


      // Convert the server response from JSON.
      const data = await response.json();


      // Store the returned movies in searchResults.
      setSearchResults(data);


      // Display a message if no movies matched the criteria.
      if (data.length === 0) {
        setSearchMessage('No movies matched the search criteria.');
      }

    } catch (error) {

      console.error('Search error:', error);

      setSearchMessage(
        'An error occurred while searching for movies.'
      );

      setSearchResults([]);
    }
  };


  return (
    <div
    style={{
            minHeight: 'calc(100vh - 64px)',
            backgroundImage: `url(${searchPage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            fontFamily: '"Times New Roman", Times, serif',
            padding: '40px',
            boxSizing: 'border-box'
          }}
      >
    <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          padding: '15px 20px',
          borderRadius: '8px',
          display: 'inline-block'
        }}
      >
      
      <Typography 
        variant="h3" 
        color="red" 
        noWrap
        sx={{ fontWeight: 'bold' }}
        >
        Search Movies
      </Typography>

      <Typography variant="body1" color="black">
        Search for a movie to learn more about it.
      </Typography>
    </Box>


       <br />

       <TextField
        id="search-title"
        label="Movie Title"
        variant="outlined"
        value={searchTitle}
        onChange={(event) => setSearchTitle(event.target.value)}
        sx = {{
        backgroundColor: 'white'
        }}
      />


      <br />
      <br />

      <TextField
        id="search-actor"
        label="Actor"
        variant="outlined"
        value={searchActor}
        onChange={(event) => setSearchActor(event.target.value)}
        sx = {{
        backgroundColor: 'white'
        }}
      />


      <br />
      <br />

      <TextField
        id="search-director"
        label="Director"
        variant="outlined"
        value={searchDirector}
        onChange={(event) => setSearchDirector(event.target.value)}
        sx = {{
        backgroundColor: 'white'
        }}
      />


      <br />
      <br />

      <Button
        id="search-button"
        variant="contained"
        onClick={handleSearch}
      >
        Find Movies
      </Button>


      <br />
      <br />

      <div id="search-results">


        {/* Display an error or no-results message. */}

        {searchMessage && (
          <Typography variant="body1" color='white'>
            {searchMessage}
          </Typography>
        )}

        {/* Display each movie returned by the server. */}

        {searchResults.map((movie, movieIndex) => (

          <div
            key={movie.movieID || movieIndex}
            style={{ 
              marginBottom: '30px',
              backgroundColor: 'rgba(255, 215, 0, 0.75)',
              padding: '15px',
              borderRadius: '8px',
              width: 'fit-content' }}
          >

             <Typography variant="body1" color='white'>
              Movie: {movie.movieTitle}
            </Typography>

             <Typography variant="body1" color='white'>
              Director(s): {movie.directors}
            </Typography>

            <Typography variant="body1" color='white'>
              Average Rating:{' '}
              {
                movie.averageRating === null ||
                movie.averageRating === undefined
                  ? 'N/A'
                  : Number(movie.averageRating).toFixed(1)
              }
            </Typography>

            {/* Left off at 6 (g) (iv) Exact prefix "Reviews" */}

            <Typography variant="body1" color='white'>
              Reviews:
            </Typography>

            {/* Put each review on a separate line. */}

            {
              movie.reviews &&
              movie.reviews.length > 0
                ? movie.reviews.map(
                    (review, reviewIndex) => (

                      <Typography
                        variant="body1"
                        key={reviewIndex}
                        style={{ marginLeft: '30px' }}
                        color = 'white'
                      >
                        {review}
                      </Typography>

                    )
                  )
                : (
                    <Typography
                      variant="body1" 
                      style={{ marginLeft: '30px' }}
                      color='white'
                    >
                      No reviews
                    </Typography>
                  )
            }
            </div>
            ))}
          </div>
    </div>
  );
}

export default Search;
