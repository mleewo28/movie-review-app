import * as React from 'react';
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import { Typography, TextField } from '@mui/material';

const ReviewTitle = ({ enteredTitle, handleTitleChange }) => {

  //states declarations
  //constants and functions declarations

  return (
    <>

      <TextField
        label="Enter your review title"
        value={enteredTitle}
        onChange={handleTitleChange}
        fullWidth
        id="review-title"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)'
        }}
      />


    </>
  );
}

export default ReviewTitle;
