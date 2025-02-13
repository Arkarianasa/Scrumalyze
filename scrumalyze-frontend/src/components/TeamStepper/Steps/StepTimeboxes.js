import React from 'react';
import { Box, Grid, TextField, Button } from '@mui/material';

const StepTimeboxes = ({ formValues, handleChange }) => {
    // Handle changes to individual timeboxes
    const handleTimeboxChange = (index, field, value) => {
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

    // Add a new timebox
    const addTimebox = () => {
        const newTimebox = { timeboxDescription: '', duration: '' };
        handleChange('timeboxes', [...formValues.timeboxes, newTimebox]);
    };

    return (
        <Box>
            {formValues.timeboxes.map((timebox, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px' }}>
                    <Grid item xs={8}>
                        <TextField
                            label="Timebox Description"
                            variant="outlined"
                            value={timebox.timeboxDescription}
                            onChange={(e) => handleTimeboxChange(index, 'timeboxDescription', e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Duration in work hours"
                            variant="outlined"
                            value={timebox.duration}
                            onChange={(e) => handleTimeboxChange(index, 'duration', e.target.value)}
                            fullWidth
                            required
                        />
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
