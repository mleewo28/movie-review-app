import React from 'react';
import { TextField } from '@mui/material';

const ReviewBody = ({ enteredReview, handleReviewChange }) => {

  //states declarations
  //constants and functions declarations

  return (
    <>

      <TextField
        id="review-body"
        label="Enter your review"
        value={enteredReview}
        onChange={handleReviewChange}
        multiline
        rows={4}
        fullWidth
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)'
        }}
      />


    </>
  );
}

export default ReviewBody;
