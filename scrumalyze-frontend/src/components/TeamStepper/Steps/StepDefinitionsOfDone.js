import React from 'react';
import { Box, Grid, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

const StepDefinitionsOfDone = ({ formValues, handleChange }) => {
    const definitionsOfDone = formValues.definitionsOfDone || []; // Fallback to an empty array

    const handleDoDChange = (index, field, value) => {
        const updatedDoDs = definitionsOfDone.map((DoD, i) =>
            i === index ? { ...DoD, [field]: value } : DoD
        );
        handleChange('definitionsOfDone', updatedDoDs);
    };

    const handleDeleteDoD = (index) => {
        const updatedDoDs = definitionsOfDone.filter((_, i) => i !== index);
        handleChange('definitionsOfDone', updatedDoDs);
    };

    const addDoD = () => {
        const newDoD = { constraintDescription: '', isCompanyPolicy: false };
        handleChange('definitionsOfDone', [...definitionsOfDone, newDoD]);
    };

    return (
        <Box>
            {definitionsOfDone.map((DoD, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px' }}>
                    <Grid item xs={9}>
                        <TextField
                            label="Definition of Done"
                            variant="outlined"
                            value={DoD.constraintDescription}
                            onChange={(e) => handleDoDChange(index, 'constraintDescription', e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={DoD.isCompanyPolicy}
                                    onChange={(e) => handleDoDChange(index, 'isCompanyPolicy', e.target.checked)}
                                />
                            }
                            label="Is Company Policy"
                            labelPlacement="top"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteDoD(index)}
                            fullWidth
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            ))}
            <Button variant="contained" color="primary" onClick={addDoD}>
                Add Definition of Done
            </Button>
        </Box>
    );
};

export default StepDefinitionsOfDone;
