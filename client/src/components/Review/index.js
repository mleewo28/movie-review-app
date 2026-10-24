import React, { useState, useEffect } from 'react';
import ReviewTitle from './ReviewTitle';
import ReviewBody from './ReviewBody';
import ReviewRating from './ReviewRating';
import MovieSelection from './MovieSelection';
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import { Grid, Typography, Button } from '@mui/material';
import reviewPage from '../../assets/reviewPage.png';
import Box from '@mui/material/Box';

const Review = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredReview, setEnteredReview] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [userID, setUserID] = useState('1');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  // D2: read the list of movies from MySQL through the NodeJS API upon first render
  useEffect(() => {
    fetch('/api/movies')
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error('Error fetching movies:', error));
  }, []);


  const handleMovieChange = (event) => {
    setSelectedMovie(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, selectedMovie: false }));
    setShowConfirmation(false);
  };

  const handleTitleChange = (event) => {
    setEnteredTitle(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, enteredTitle: false }));
    setShowConfirmation(false);
  };

  const handleReviewChange = (event) => {
    setEnteredReview(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, enteredReview: false }));
    setShowConfirmation(false);
  };

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, selectedRating: false }));
    setShowConfirmation(false);
  };

  const selectedMovieName = () => {
    const movie = movies.find((m) => m.id === selectedMovie);
    return movie ? movie.name : '';
  };

  const handleSubmit = () => {
    let hasErrors = false;
    const newErrors = {};

    if (!selectedMovie) {
      newErrors.selectedMovie = true;
      hasErrors = true;
    }
    if (!enteredTitle) {
      newErrors.enteredTitle = true;
      hasErrors = true;
    }
    if (!enteredReview) {
      newErrors.enteredReview = true;
      hasErrors = true;
    }
    if (!selectedRating) {
      newErrors.selectedRating = true;
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setShowConfirmation(false);
      return;
    }

    // D2: send the review to the NodeJS API, which inserts it into MySQL
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieID: selectedMovie,
        userID: userID,
        reviewTitle: enteredTitle,
        reviewContent: enteredReview,
        reviewScore: selectedRating,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Server error while saving the review');
        }
        setShowConfirmation(true);
        setErrors({});
      })
      .catch((error) => console.error('Error submitting review:', error));
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        backgroundImage: `url(${reviewPage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: '"Times New Roman", Times, serif',
        padding: '40px',
        boxSizing: 'border-box'
      }}
    >



      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h3"
            noWrap
            sx={{
              fontFamily: 'Times new roman',
              color: 'white'
            }}
          >
            Review a movie
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Times new roman',
              color: 'white'
            }}
          >
            Create and submit a review for a movie!
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MovieSelection
            movies={movies}
            selectedMovie={selectedMovie}
            handleMovieChange={handleMovieChange}
          />
          {errors.selectedMovie && <Typography color="red">Select your movie</Typography>}
        </Grid>
        <Grid item xs={12}>
          <ReviewTitle enteredTitle={enteredTitle} handleTitleChange={handleTitleChange} />
          {errors.enteredTitle && <Typography color="red">Enter your review title</Typography>}
        </Grid>
        <Grid item xs={12}>
          <ReviewBody enteredReview={enteredReview} handleReviewChange={handleReviewChange} />
          {errors.enteredReview && <Typography color="red">Enter your review</Typography>}
        </Grid>
        <Grid item xs={12}>
          <ReviewRating selectedRating={selectedRating} handleRatingChange={handleRatingChange} />
          {errors.selectedRating && <Typography color="red">Select the rating</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} id="submit-button">
            Submit
          </Button>
        </Grid>
        {showConfirmation && (
          <Grid
            item
            xs={12}
          >
            <Box
              sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.80)',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '20px'
            }}
            >
            <Typography variant="h6" id="confirmation-message">Your review has been received</Typography>
            <Typography variant="subtitle1">Movie: {selectedMovieName()}</Typography>
            <Typography variant="subtitle1">Review Title: {enteredTitle}</Typography>
            <Typography variant="subtitle1">Review Body: {enteredReview}</Typography>
            <Typography variant="subtitle1">Rating: {selectedRating}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>


    </div>
  );
}

export default Review;
