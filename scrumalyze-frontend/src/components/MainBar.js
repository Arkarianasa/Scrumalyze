import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Tooltip } from '@mui/material';
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
  const { setCurrentPage, currentPage, selectedTeam } = useContext(GlobalContext); // Accessing setCurrentPage from GlobalContext

  return (
    <AppBar position="static" className={classes.header} style={{ backgroundColor: '#004aad', position: 'fixed', zIndex: 1000, }}>
      <Toolbar>
        <Tooltip title="Back to main page" slotProps={{ popper: { modifiers: [ { name: 'offset', options: { offset: [0, -20], }, }, ], }, }}>
          <IconButton edge="start" color="inherit" onClick={() => setCurrentPage('main')}>
            <img src={logo_white} alt="Logo" className={classes.logo} />
          </IconButton>
        </Tooltip>
        <Typography variant="h6" style={{ flexGrow: 1, marginLeft : "20px" }} >
          {(currentPage == "team-dashboard")? "Team " + selectedTeam.teamName + " Dashboard" : "Add New Team"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MainBar;
