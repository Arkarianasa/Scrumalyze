import React from 'react';
import { Box, Grid, TextField, Button } from '@mui/material';

const StepTimeboxes = ({ formValues, handleChange }) => {
  // Handle changes to individual timeboxes
  const handleTimeboxChange = (index, field, value) => {
    // If the field should be a positive integer, try parsing and enforce non-negative values.
    if (['days', 'hours', 'minutes'].includes(field)) {
      const intValue = parseInt(value, 10);
      // If input is empty or not a positive int, store empty string, otherwise store the integer.
      value = isNaN(intValue) || intValue < 0 ? '' : intValue;
    }
    const updatedTimeboxes = formValues.timeboxes.map((timebox, i) =>
      i === index ? { ...timebox, [field]: value } : timebox
    );
    handleChange('timeboxes', updatedTimeboxes);
  };

  // Handle deletion of a timebox
  const handleDeleteTimebox = (index) => {
    const updatedTimeboxes = formValues.timeboxes.filter((_, i) => i !== index);
    handleChange('timeboxes', updatedTimeboxes);
  };

  // Add a new timebox with three duration values
  const addTimebox = () => {
    const newTimebox = { timeboxDescription: '', days: '', hours: '', minutes: '' };
    handleChange('timeboxes', [...formValues.timeboxes, newTimebox]);
  };

  return (
    <Box>
      {formValues.timeboxes.map((timebox, index) => (
        <Grid container spacing={2} key={index} style={{ marginBottom: '20px' }}>
          <Grid item xs={6}>
            <TextField
              label="Timebox Description"
              variant="outlined"
              value={timebox.timeboxDescription}
              onChange={(e) => handleTimeboxChange(index, 'timeboxDescription', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={5}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TextField
                  label="Days"
                  variant="outlined"
                  type="number"
                  value={timebox.days}
                  onChange={(e) => handleTimeboxChange(index, 'days', e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Hours"
                  variant="outlined"
                  type="number"
                  value={timebox.hours}
                  onChange={(e) => handleTimeboxChange(index, 'hours', e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Minutes"
                  variant="outlined"
                  type="number"
                  value={timebox.minutes}
                  onChange={(e) => handleTimeboxChange(index, 'minutes', e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDeleteTimebox(index)}
              fullWidth
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button variant="contained" color="primary" onClick={addTimebox}>
        Add Timebox
      </Button>
    </Box>
  );
};

export default StepTimeboxes;
