import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Landing from '../Landing';
import Search from '../Search';
import Review from '../Review';
import MyReviews from '../MyReviews';
import Navbar from '../Navbar';


const App = () => {


  return (
    <Router>
        <div>
          <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/Search" element={<Search />} />
              <Route path="/Review" element={<Review />} />
              <Route path="/MyReviews" element={<MyReviews />} />

            </Routes>
      </div>
    </Router>
  );
}

export default App;
