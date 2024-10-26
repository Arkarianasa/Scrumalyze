import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { GlobalContext } from '../context/GlobalContext';
import logo_white from '../logo_white.png';

const useStyles = makeStyles((theme) => ({
  header: {
    height: '60px',
    width: '100%',
  },
  logo: {
    marginTop: '-10px',
    height: '65px', // Adjust based on your logo's aspect ratio
    width: 'auto',
  },
}));

const MainBar = () => {
  const classes = useStyles();
  const { setCurrentPage } = useContext(GlobalContext); // Accessing setCurrentPage from GlobalContext

  return (
    <AppBar position="static" className={classes.header} style={{ backgroundColor: '#004aad' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => setCurrentPage('main')}>
          <img src={logo_white} alt="Logo" className={classes.logo} />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MainBar;
