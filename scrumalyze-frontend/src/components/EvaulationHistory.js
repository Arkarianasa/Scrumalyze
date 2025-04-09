import React, { useContext } from 'react';
import {
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext';

const EvaulationHistory = () => {
  const { teamData, loading } = useContext(TeamContext);
  const { selectedTeam } = useContext(GlobalContext);
  

  return (
    <Box></Box>
  );
};

export default EvaulationHistory;
