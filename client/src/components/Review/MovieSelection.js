import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const MovieSelection = ({ movies, selectedMovie, handleMovieChange }) => {

  //states declarations
  //constants and functions declarations

  return (
    <>
    
    <FormControl fullWidth>
      <InputLabel id="movie-select-label">Select a movie</InputLabel>
      <Select
        value={selectedMovie}
        onChange={handleMovieChange}
        labelId="movie-select-label"
        id="movie-select"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)'
        }}
      >
        {movies.map((movie) => (
          <MenuItem key={movie.id} value={movie.id}>
            {movie.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>


    </>
  );
}

export default MovieSelection;
