import React, { useContext } from 'react';
import { Box, TextField, MenuItem, Grid, Button } from '@mui/material';
import { GlobalContext } from '../../../context/GlobalContext';

const StepProductGoals = ({ formValues, handleChange }) => {
    const { scrumRoles } = useContext(GlobalContext);

    const handleProductGoalChange = (index, field, value) => {
        const updatedGoals = formValues.productGoals.map((goal, i) =>
            i === index ? { ...goal, [field]: value } : goal
        );
        handleChange('productGoals', updatedGoals);
    };

    const handleAddGoal = () => {
        handleChange('productGoals', [
            ...formValues.productGoals,
            { description: '', responsiblePersonID: '' },
        ]);
    };

    const handleDeleteGoal = (index) => {
        const updatedGoals = formValues.productGoals.filter((_, i) => i !== index);
        handleChange('productGoals', updatedGoals);
    };

    return (
        <Box>
            {formValues.productGoals.map((goal, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px', alignItems: 'center' }}>
                    <Grid item xs={8}>
                        <TextField
                            label="Product Goal Description"
                            variant="outlined"
                            fullWidth
                            value={goal.description}
                            onChange={(e) => handleProductGoalChange(index, 'description', e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            select
                            label="Responsible Person"
                            variant="outlined"
                            fullWidth
                            value={goal.responsiblePersonID}
                            onChange={(e) => handleProductGoalChange(index, 'responsiblePersonID', e.target.value)}
                            required
                        >
                            <MenuItem key="wholeTeam" value="The Whole Team">
                                Whole Team
                            </MenuItem>
                            {formValues.persons.map((person, idx) => (
                                <MenuItem key={idx} value={idx}>
                                    {person.firstName} {person.lastName} (
                                    {(person.roleID - scrumRoles.length > 0
                                        ? formValues.scrumRoles[person.roleID - scrumRoles.length - 1].roleName
                                        : scrumRoles[person.roleID - 1].roleName)}
                                    )
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="outlined" color="error" onClick={() => handleDeleteGoal(index)}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            ))}
            <Button variant="contained" color="primary" onClick={handleAddGoal}>
                Add Product Goal
            </Button>
        </Box>
    );
};

export default StepProductGoals;
