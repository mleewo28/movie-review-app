import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Select, MenuItem } from '@mui/material';
//import { Number } from 'prop-types';
import myReview from '../../assets/myReview.png';


const MyReviews = () => {
  // 8 b) State for storing the current user's review 
  const [reviews, setReviews] = useState([])

  //8d) states used when editing a review 
  // stores the reviewID of the review currently being edited 
  //null means that no review is currently being edited. 
  const [editingReviewID, setEditingReviewID] = useState(null);

  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('')
  const [editScore, setEditScore] = useState('')

  // Used for validation/error messages while editing
  const [editError, setEditError] = useState('');

  //state for sorting reviews 
  const [sortOption, setSortOption] = useState('');

  // 8 g) filtering reviews by review score 
  const [filterScore, setFilterScore] = useState('all');

  // 8(c)(i): Retrieve all reviews for the current user
  // GET /api/myReviews

  const loadReviews = () => {

    fetch('/api/myReviews')
      .then((response) => response.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error('Error retrieving reviews:', data);
          setReviews([]);
        }

      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      });
  };

  // Load the user's reviews when MyReviews first renders
  useEffect(() => {
    loadReviews();
  }, []);

  // 8(d)(i) and 8(d)(ii):
  // Put one review into edit mode
  const handleEdit = (review) => {

    setEditingReviewID(review.reviewID);

    setEditTitle(review.reviewTitle);
    setEditBody(review.reviewContent);
    setEditScore(review.reviewScore);

    setEditError('');
  };

  // 8(d)(iii) and 8(d)(iv):
  // Validate and save an edited review

  const handleSave = async (reviewID) => {
    //Review title cannot be empty 
    if (!editTitle) {
      setEditError("Enter your review title");
      return;
    }

    // Review body cannot be empty
    if (!editBody) {
      setEditError("Enter your review");
      return;
    }

    if (editBody.length > 200) {
      setEditError("Review body must be 200 characters or less.");
      return;
    }

    //Rating must be between 1-5 
    if (!editScore || Number(editScore) < 1 || Number(editScore) > 5 ||
      !Number.isInteger(Number(editScore))) {
      setEditError("Rating must be an integer between 1 and 5.");
      return;
    }

    try {
      // 8(d)(iv):
      const response = await fetch(
        `/api/myReviews/${reviewID}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            reviewTitle: editTitle,
            reviewContent: editBody,
            reviewScore: editScore
          })
        }
      );


      if (!response.ok) {
        throw new Error('Unable to update review');
      }


      // Exit edit mode
      setEditingReviewID(null);

      setEditError('');

      // 8(d)(v):
      // Retrieve the updated reviews after saving

      loadReviews();

    } catch (error) {

      console.error('Error updating review:', error);

      setEditError('An error occurred while updating the review.');
    }
  };

  //8 e) ii) and 8 e) iii) Delete a review, then refresh the displayed list 
  const handleDelete = async (reviewID) => {

    try {

      const response = await fetch(
        `/api/myReviews/${reviewID}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Unable to delete review');
      }

      // Refresh the list after deletion
      loadReviews();

    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // 8 h) make sorting and filtering work together. Apply filtering first, then sort
  let displayedReviews = [...reviews];

  // Filter by score
  if (filterScore !== 'all') {
    displayedReviews = displayedReviews.filter(
      (review) =>
        Number(review.reviewScore) === Number(filterScore)
    );
  }


  // Sort the filtered results
  if (sortOption === 'movie') {

    displayedReviews.sort((a, b) =>
      a.movieName.localeCompare(b.movieName)
    );

  } else if (sortOption === 'score-high') {

    displayedReviews.sort(
      (a, b) =>
        Number(b.reviewScore) - Number(a.reviewScore)
    );

  } else if (sortOption === 'score-low') {

    displayedReviews.sort(
      (a, b) =>
        Number(a.reviewScore) - Number(b.reviewScore)
    );
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        backgroundImage: `url(${myReview})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: '"Times New Roman", Times, serif',
        padding: '40px',
        boxSizing: 'border-box'
      }}>
      <Typography variant="h3" color="inherit" noWrap>
        My Reviews
      </Typography>

      <Typography variant="body1" color="inherit">
        Your submitted movie reviews.
      </Typography>

      {/* TODO: my reviews page */}

      {/* Sorting dropdown 8f) */}
      <Select
        id="sort-select"
        value={sortOption}
        onChange={(event) => setSortOption(event.target.value)}
        displayEmpty
      >
        <MenuItem value="">
          Sort Reviews
        </MenuItem>

        <MenuItem value="movie">
          Movie name (A-Z)
        </MenuItem>

        <MenuItem value="score-high">
          Score (highest first)
        </MenuItem>

        <MenuItem value="score-low">
          Score (lowest first)
        </MenuItem>
      </Select>

      {/* Filtering the reviews. Filtering dropdown 8g)*/}
      <Select
        id="filter-select"
        value={filterScore}
        onChange={(event) => setFilterScore(event.target.value)}
      >
        <MenuItem value="all">
          All
        </MenuItem>

        <MenuItem value="1">
          1
        </MenuItem>

        <MenuItem value="2">
          2
        </MenuItem>

        <MenuItem value="3">
          3
        </MenuItem>

        <MenuItem value="4">
          4
        </MenuItem>

        <MenuItem value="5">
          5
        </MenuItem>
      </Select>

      {/* 8(c)(iii): Display if the user has no reviews */}
      {reviews.length === 0 && (
        <Typography variant="body1">
          No reviews found
        </Typography>
      )}

      {/*   8(c)(ii): Display each review */}

      {displayedReviews.map((review) => (

        <div
          key={review.reviewID}
          style={{ marginBottom: '30px' }}
        >

          <Typography variant="body1">
            Movie: {review.movieName}
          </Typography>

          <Typography variant="body1">
            Review Title: {review.reviewTitle}
          </Typography>

          <Typography variant="body1">
            Review: {review.reviewContent}
          </Typography>

          <Typography variant="body1">
            Score: {review.reviewScore}
          </Typography>

          <Button
            id={`edit-${review.reviewID}`}
            variant="contained"
            onClick={() => handleEdit(review)}
            sx={{
              backgroundColor: 'salmon',
              '&:hover': {
                backgroundColor: 'darksalmon',
              },
            }}
          >
            Edit
          </Button>

          {/* delete button */}
          <Button
            id={`delete-${review.reviewID}`}
            variant="contained"
            onClick={() => handleDelete(review.reviewID)}
            sx={{
              backgroundColor: 'salmon',
              '&:hover': {
                backgroundColor: 'darksalmon',
              },
            }}
          >
            Delete
          </Button>

          {editingReviewID === review.reviewID && (

            <div>

              <br />

              <TextField
                id="edit-title"
                label="Review Title"
                value={editTitle}
                onChange={(event) =>
                  setEditTitle(event.target.value)
                }
              />

              <br />
              <br />

              <TextField
                id="edit-body"
                label="Review"
                multiline
                value={editBody}
                onChange={(event) =>
                  setEditBody(event.target.value)
                }
              />

              <br />
              <br />

              <TextField
                id="edit-score"
                label="Rating"
                type="number"
                value={editScore}
                onChange={(event) =>
                  setEditScore(event.target.value)
                }
              />

              {editError && (
                <Typography color="red">
                  {editError}
                </Typography>
              )}



              <br />

              <Button
                id="save-review"
                variant="contained"
                onClick={() =>
                  handleSave(review.reviewID)
                }
                sx={{
                  backgroundColor: 'salmon',
                  '&:hover': {
                    backgroundColor: 'darksalmon',
                  },
                }}
              >
                Save
              </Button>

            </div>
          )}

        </div>

      ))}


    </div>
  );
};


export default MyReviews;
