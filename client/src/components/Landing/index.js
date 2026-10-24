import React from 'react';
import Typography from '@mui/material/Typography';
import movieTheatre from '../../assets/movie_theatre.png';
import Box from '@mui/material/Box';

const Landing = () => {


  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        backgroundImage: `url(${movieTheatre})`,
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
          sx={{
            fontFamily: 'Times new roman',
            color: 'salmon'
          }}>
          Welcome to the Movie Review App
        </Typography>

        <Typography 
          variant="body1"
          sx={{
            fontFamily: 'Times new roman',
            color: 'black'
          }}
          >
          Search for movies, write reviews, and view your submitted reviews.
        </Typography>
      </Box>


    </div>
  );
}

export default Landing;
