import React from 'react';
import { Box, Grid, TextField, Button } from '@mui/material';

const StepAcceptanceCriterias = ({ formValues, handleChange }) => {
    const acceptanceCriterias = formValues.acceptanceCriterias || []; // Fallback to an empty array

    const handleAcceptanceCriteriaChange = (index, field, value) => {
        const updatedCriterias = acceptanceCriterias.map((criteria, i) =>
            i === index ? { ...criteria, [field]: value } : criteria
        );
        handleChange('acceptanceCriterias', updatedCriterias);
    };

    const handleDeleteAcceptanceCriteria = (index) => {
        const updatedCriterias = acceptanceCriterias.filter((_, i) => i !== index);
        handleChange('acceptanceCriterias', updatedCriterias);
    };

    const addAcceptanceCriteria = () => {
        const newCriteria = { constraintDescription: '' };
        handleChange('acceptanceCriterias', [...acceptanceCriterias, newCriteria]);
    };

    return (
        <Box>
            {acceptanceCriterias.map((acceptanceCriteria, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px' }}>
                    <Grid item xs={11}>
                        <TextField
                            label="Acceptance Criteria"
                            variant="outlined"
                            value={acceptanceCriteria.constraintDescription}
                            onChange={(e) =>
                                handleAcceptanceCriteriaChange(index, 'constraintDescription', e.target.value)
                            }
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteAcceptanceCriteria(index)}
                            fullWidth
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            ))}
            <Button variant="contained" color="primary" onClick={addAcceptanceCriteria}>
                Add Acceptance Criteria
            </Button>
        </Box>
    );
};

export default StepAcceptanceCriterias;
