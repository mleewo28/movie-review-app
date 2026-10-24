# Movie Review Web Application

A full-stack movie review application built with **React, Node.js, Express, and MySQL**, allowing users to discover movies, submit ratings, and manage their reviews through an interactive web interface.

## Tech Stack

- **Frontend:** React, JavaScript, Material UI (MUI)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Architecture:** RESTful APIs, client-server communication, relational database integration

## Key Features

### Movie Search
- Search for movies by title, actor, or director.
- Combine multiple search criteria to refine results.
- View movie details, directors, user reviews, and average ratings.

### Movie Reviews
- Submit movie reviews with a title, written description, and rating from 1–5.
- Validate user inputs before submitting reviews.
- Store submitted reviews in a MySQL relational database.

### Review Management
- View previously submitted reviews.
- Edit or delete existing reviews.
- Sort reviews alphabetically or by rating.
- Filter reviews based on rating scores.

### User Interface
- Navigate between Landing, Search, Review, and My Reviews pages using React Router.
- Interactive interface developed using Material UI components.
- Consistent visual styling across application pages.

## Technical Implementation

### Frontend Development
Developed a component-based React interface using state management and client-side routing to support navigation, form handling, and dynamic rendering of movie information.

### Backend Development
Integrated a Node.js and Express backend to handle HTTP requests between the frontend and database, supporting movie retrieval, review submission, updates, and deletion.

### Database Management
Used MySQL to manage relational data involving movies, users, and reviews. Implemented SQL queries to retrieve movie information, apply search criteria, and maintain review records.

## Getting Started

This application was originally developed using a university-hosted MySQL database accessed through an SSH tunnel.

For security purposes, database credentials and connection details in `config.js` have been replaced with placeholders.

Running the application requires access to a compatible MySQL database and updating the connection configuration.