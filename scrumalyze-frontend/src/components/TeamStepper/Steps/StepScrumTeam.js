import React from 'react';
import { Box, TextField } from '@mui/material';

const StepScrumTeam = ({ formValues, handleChange }) => (
  <Box>
    <TextField
      label="Team Name"
      variant="outlined"
      fullWidth
      value={formValues.teamName}
      onChange={(e) => handleChange('teamName', e.target.value)}
      required
      style={{ marginBottom: '20px' }}
    />
    <TextField
      label="Work Day Hours"
      variant="outlined"
      value={formValues.workDayHours}
      onChange={(e) => handleChange('workDayHours', e.target.value)}
      fullWidth
      required
    />
  </Box>
);

export default StepScrumTeam;