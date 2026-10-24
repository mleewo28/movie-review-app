import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div>
            <AppBar position="static"
            sx={{ backgroundColor: "black" }}
            >
                <Toolbar>

                    <Typography
                        variant="h5"
                        color="inherit"
                        sx={{ flexGrow: 1 }}
                    >
                        Movie Review App
                    </Typography>

                    <Button
                        id="nav-landing"
                        color="inherit"
                        onClick={() => navigate('/')}
                    >
                        Landing
                    </Button>

                    <Button
                        id="nav-search"
                        color="inherit"
                        onClick={() => navigate('/Search')}
                    >
                        Search
                    </Button>

                    <Button
                        id="nav-review"
                        color="inherit"
                        onClick={() => navigate('/Review')}
                    >
                        Review
                    </Button>

                    <Button
                        id="nav-myReviews"
                        color="inherit"
                        onClick={() => navigate('/MyReviews')}
                    >
                        My Reviews
                    </Button>

                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;