import React, {useContext} from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';

import { GlobalContext } from '../../../context/GlobalContext';

const StepIncrements = ({ formValues, handleChange }) => {

  const { scrumRoles } = useContext(GlobalContext);

  const handleIncrementChange = (index, field, value) => {
    const updatedIncrements = formValues.increments.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleChange('increments', updatedIncrements);
  };

  const handleDeleteIncrement = (index) => {
    const updatedIncrements = formValues.increments.filter((_, i) => i !== index);
    handleChange('increments', updatedIncrements);
  };

  const addIncrement = () => {
    const newItem = {
        description: '',
        relatedSprintDtoID: null,
        relatedProductGoalDtoID: null,
        receivedByPersonDtoID: null,
        deadline: ''
    };
    handleChange('increments', [...formValues.increments, newItem]);
  };

  return (
    <Box>
    {formValues.increments.map((increment, index) => (
        <Grid container spacing={2} key={index} style={{ marginBottom: '40px' }}>
        <Grid item xs={5}>
            <TextField
            label="Increment Description"
            variant="outlined"
            value={increment.description}
            onChange={(e) => handleIncrementChange(index, 'description', e.target.value)}
            fullWidth
            required
            />
        </Grid>
        <Grid item xs={4}>
            <TextField
            select
            label="Related Sprint"
            variant="outlined"
            value={increment.RelatedSprintDtoID}
            onChange={(e) => handleIncrementChange(index, 'relatedSprintDtoID', e.target.value)}
            fullWidth
            >
            <MenuItem key="none" value={null}>
                None
            </MenuItem>
            {formValues.sprints.map((sprint, sprintIndex) => (
                <MenuItem key={sprintIndex} value={sprintIndex}>
                {sprint.sprintGoal}
                </MenuItem>
            ))}
            </TextField>
        </Grid>
        <Grid item xs={3}>
            <TextField
            select
            label="Received By"
            variant="outlined"
            value={increment.receivedByPersonDtoID}
            onChange={(e) => handleIncrementChange(index, 'receivedByPersonDtoID', e.target.value)}
            fullWidth
            >
            <MenuItem key="none" value={null}>
                None
            </MenuItem>
            {formValues.persons.map((person, personIndex) => (
                <MenuItem key={personIndex} value={personIndex}>
                {person.firstName} {person.lastName}
                </MenuItem>
            ))}
            </TextField>
        </Grid>
        <Grid item xs={5}>
            <Autocomplete
            multiple
            options={formValues.workItems}
            getOptionLabel={(option) => option.description || 'Unnamed Work Item'}
            value={formValues.workItems.filter((_, i) => increment.workItems?.includes(i))}
            onChange={(e, newValue) => {
                const selectedIndexes = newValue.map((item) => formValues.workItems.indexOf(item));
                handleIncrementChange(index, 'workItems', selectedIndexes);
            }}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Pick Work Items" fullWidth />
            )}
            />
        </Grid>
        <Grid item xs={2}>
            <TextField
            label="Deadline"
            variant="outlined"
            type="date"
            value={increment.deadline}
            onChange={(e) => handleIncrementChange(index, 'deadline', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            />
        </Grid>

        <Grid item xs={4}>
            <TextField
            select
            label="Related Product Goal"
            variant="outlined"
            value={increment.relatedProductGoalDtoID || ''}
            onChange={(e) => handleIncrementChange(index, 'relatedProductGoalDtoID', e.target.value)}
            fullWidth
            >
            <MenuItem key="none" value={null}>
                None
            </MenuItem>
            {formValues.productGoals.map((goal, goalIndex) => (
                <MenuItem key={goalIndex} value={goalIndex}>
                {goal.description}
                </MenuItem>
            ))}
            </TextField>
        </Grid>

        <Grid item xs={1}>
            <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteIncrement(index)}
            fullWidth
            >
            Delete
            </Button>
        </Grid>
        </Grid>
    ))}
    <Button variant="contained" color="primary" onClick={addIncrement}>
        Add Increment
    </Button>
    </Box>

  );
};

export default StepIncrements;
