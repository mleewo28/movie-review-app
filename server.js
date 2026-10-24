import mysql from 'mysql';
import config from './config.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

// GET /api/movies - retrieve all movies from the movies table
app.get('/api/movies', (req, res) => {
  const connection = mysql.createConnection(config);

  const sql = 'SELECT id, name, year, quality FROM movies';
  connection.query(sql, (error, results) => {
    connection.end();
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error retrieving movies' });
    }
    res.json(results);
  });
});


// POST /api/reviews - insert a user-created review into the Review table
app.post('/api/reviews', (req, res) => {
  const { movieID, userID, reviewTitle, reviewContent, reviewScore } = req.body;

  if (!movieID || !userID || !reviewTitle || !reviewContent || !reviewScore) {
    return res.status(400).json({ error: 'All review fields are required' });
  }

  const connection = mysql.createConnection(config);

  const sql = `INSERT INTO Review (userID, movieID, reviewTitle, reviewContent, reviewScore)
               VALUES (?, ?, ?, ?, ?)`;
  const values = [userID, movieID, reviewTitle, reviewContent, reviewScore];

  connection.query(sql, values, (error, result) => {
    connection.end();
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error inserting review' });
    }
    res.status(201).json({ message: 'Review added', reviewID: result.insertId });
  });
});


//SEARCH 
// POST /api/searchMovies
// Search by movie title, actor, director, or a combination

app.post('/api/searchMovies', (req, res) => {

  const { title, actor, director } = req.body;

  // Convert empty/undefined values into clean strings
  const titleValue = (title || '').trim();
  const actorValue = (actor || '').trim();
  const directorValue = (director || '').trim();

  const connection = mysql.createConnection(config);

  // Main movie search
  // If the field is blank -> ignore that condition
  // If the field has a value -> require an exact match

  const sql = `
    SELECT
      M.id AS movieID,
      M.name AS movieTitle,

      (
        SELECT GROUP_CONCAT(
          DISTINCT CONCAT(D.first_name, ' ', D.last_name)
          SEPARATOR ', '
        )
        FROM movies_directors MD, directors D
        WHERE MD.director_id = D.id
        AND MD.movie_id = M.id
      ) AS directors,

      (
        SELECT AVG(R.reviewScore)
        FROM Review R
        WHERE R.movieID = M.id
      ) AS averageRating

    FROM movies M

    WHERE
      (? = '' OR M.name = ?)

    AND
      (
        ? = ''
        OR EXISTS (
          SELECT *
          FROM roles RO, actors A
          WHERE RO.actor_id = A.id
          AND RO.movie_id = M.id
          AND CONCAT(A.first_name, ' ', A.last_name) = ?
        )
      )

    AND
      (
        ? = ''
        OR EXISTS (
          SELECT *
          FROM movies_directors MD2, directors D2
          WHERE MD2.director_id = D2.id
          AND MD2.movie_id = M.id
          AND CONCAT(D2.first_name, ' ', D2.last_name) = ?
        )
      )
  `;


  const values = [
    titleValue,
    titleValue,

    actorValue,
    actorValue,

    directorValue,
    directorValue
  ];


  connection.query(sql, values, (error, movieResults) => {

    if (error) {
      connection.end();

      console.error('Search query error:', error);

      return res.status(500).json({
        error: 'Error searching for movies'
      });
    }


    // If nothing matched, simply return an empty array
    if (movieResults.length === 0) {
      connection.end();
      return res.json([]);
    }


    
    // Retrieve all review CONTENT for the matching movies

    const movieIDs = movieResults.map(
      (movie) => movie.movieID
    );


    const reviewSql = `
      SELECT
        movieID,
        reviewContent
      FROM Review
      WHERE movieID IN (?)
    `;


    connection.query(
      reviewSql,
      [movieIDs],
      (reviewError, reviewResults) => {

        connection.end();


        if (reviewError) {

          console.error('Review search error:', reviewError);

          return res.status(500).json({
            error: 'Error retrieving reviews'
          });
        }

        // Attach the reviews to the corresponding movie

        const results = movieResults.map((movie) => {

          const reviews = reviewResults
            .filter(
              (review) =>
                review.movieID === movie.movieID
            )
            .map(
              (review) =>
                review.reviewContent
            );


          return {
            movieID: movie.movieID,
            movieTitle: movie.movieTitle,
            directors: movie.directors,
            averageRating: movie.averageRating,
            reviews: reviews
          };

        });


        res.json(results);
      }
    );

  });

});

//MYREVIEWS  
// GET /api/myReviews - retrieve all reviews for userID = 1
app.get('/api/myReviews', (req, res) => {

  const connection = mysql.createConnection(config);

  const sql = `
    SELECT
      R.reviewID,
      R.reviewTitle,
      R.reviewContent,
      R.reviewScore,
      M.name AS movieName
    FROM Review R, movies M
    WHERE R.movieID = M.id
    AND R.userID = '1'
  `;

  connection.query(sql, (error, results) => {

    connection.end();

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Error retrieving reviews'
      });
    }

    res.json(results);
  });
});



// PUT /api/myReviews/:reviewID - update an existing review
app.put('/api/myReviews/:reviewID', (req, res) => {

  const reviewID = req.params.reviewID;

  const {
    reviewTitle,
    reviewContent,
    reviewScore
  } = req.body;


  // Validate the updated review
  if (
    !reviewTitle ||
    !reviewContent ||
    !reviewScore
  ) {
    return res.status(400).json({
      error: 'All review fields are required'
    });
  }


  if (
    reviewContent.length > 200 ||
    Number(reviewScore) < 1 ||
    Number(reviewScore) > 5
  ) {
    return res.status(400).json({
      error: 'Invalid review data'
    });
  }


  const connection = mysql.createConnection(config);

  const sql = `
    UPDATE Review
    SET reviewTitle = ?,
        reviewContent = ?,
        reviewScore = ?
    WHERE reviewID = ?
    AND userID = '1'
  `;

  const values = [
    reviewTitle,
    reviewContent,
    reviewScore,
    reviewID
  ];


  connection.query(sql, values, (error, result) => {

    connection.end();

    if (error) {
      console.error(error);

      return res.status(500).json({
        error: 'Error updating review'
      });
    }

    res.json({
      message: 'Review updated'
    });
  });
});


// DELETE /api/myReviews/:reviewID - delete a review
app.delete('/api/myReviews/:reviewID', (req, res) => {

  const reviewID = req.params.reviewID;

  const connection = mysql.createConnection(config);

  const sql = `DELETE FROM Review
               WHERE reviewID = ?
               AND userID = '1'`;

  connection.query(sql, [reviewID], (error, result) => {

    connection.end();

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Error deleting review'
      });
    }

    res.json({
      message: 'Review deleted'
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version


