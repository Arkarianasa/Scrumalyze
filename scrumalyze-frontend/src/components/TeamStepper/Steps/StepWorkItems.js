import React, { useContext, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Chip
} from '@mui/material';

import { GlobalContext } from '../../../context/GlobalContext';

const StepWorkItems = ({ formValues, handleChange }) => {
  const { scrumRoles, workItemTypes } = useContext(GlobalContext);

  const [acceptanceCriteriaInputs, setAcceptanceCriteriaInputs] = useState({});

  const handleWorkItemChange = (index, field, value) => {
    const updatedWorkItems = formValues.workItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleChange('workItems', updatedWorkItems);
  };

  const handleDeleteWorkItem = (index) => {
    const updatedWorkItems = formValues.workItems.filter((_, i) => i !== index);
    handleChange('workItems', updatedWorkItems);
  };

  const addWorkItem = () => {
    const newItem = {
      description: '',
      BacklogItemDtoID: '',
      workItemTypeID: '',
      definitionOfDoneIDs: [], // Multiple definitions of done
      acceptanceCriterias: [], // Initialize as an empty array
      done: false,
      workingPersons: [],
      TimeboxDtoID: '',
      deadline: '',
    };
    handleChange('workItems', [...formValues.workItems, newItem]);
  };

  const handleAddAcceptanceCriteria = (index, newCriteria) => {
    const updatedWorkItems = formValues.workItems.map((item, i) =>
      i === index
        ? {
            ...item,
            acceptanceCriterias: [...(item.acceptanceCriterias || []), newCriteria], // Ensure it's always an array
          }
        : item
    );
    setAcceptanceCriteriaInputs((prev) => ({
      ...prev,
      [index]: '', // Reset the input field for this index
    }));
    handleChange('workItems', updatedWorkItems);
  };
  
  const handleInputChange = (index, value) => {
    setAcceptanceCriteriaInputs((prev) => ({
      ...prev,
      [index]: value, // Update the input value for this index
    }));
  };
  
  const handleDeleteAcceptanceCriteria = (index, criteria) => {
    const updatedWorkItems = formValues.workItems.map((item, i) =>
      i === index
        ? {
            ...item,
            acceptanceCriterias: item.acceptanceCriterias.filter((c) => c !== criteria),
          }
        : item
    );
    handleChange('workItems', updatedWorkItems);
  };

  return (
    <Box>
      {formValues.workItems.map((item, index) => (
        <Box key={index} style={{ marginBottom: '40px' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Description"
                value={item.description || ''}
                onChange={(e) => handleWorkItemChange(index, 'description', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                select
                label="Backlog Item"
                value={item.BacklogItemDtoID}
                onChange={(e) => handleWorkItemChange(index, 'BacklogItemDtoID', e.target.value)}
                fullWidth
              >
                {formValues.backlogItems.map((backlog, i) => (
                  <MenuItem key={i} value={i}>
                    {backlog.itemName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                select
                label="Work Item Type"
                value={item.workItemTypeID}
                onChange={(e) => handleWorkItemChange(index, 'workItemTypeID', e.target.value)}
                fullWidth
              >
                <MenuItem key="none" value={null}>
                  None
                </MenuItem>
                {workItemTypes.map((type) => (
                  <MenuItem key={type.workItemTypeID} value={type.workItemTypeID}>
                    {type.typeName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteWorkItem(index)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '-5px' }}>
            <Grid item xs={5}>
              <Autocomplete
                multiple
                options={formValues.definitionsOfDone}
                getOptionLabel={(DoD) => DoD.constraintDescription}
                value={item.definitionOfDoneIDs.map((index) => formValues.definitionsOfDone[index])} 
                onChange={(e, newValue) => {
                  const selectedIndices = newValue.map((selectedDoD) =>
                    formValues.definitionsOfDone.indexOf(selectedDoD)
                  );
                  handleWorkItemChange(index, 'definitionOfDoneIDs', selectedIndices);
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Definitions of Done" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={5} key={index}>
              <TextField
                label="Acceptance Criteria"
                value={acceptanceCriteriaInputs[index] || ''} // Use the separate state to track input
                onChange={(e) => handleInputChange(index, e.target.value)} // Update the input field
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim() !== '') {
                    handleAddAcceptanceCriteria(index, e.target.value.trim()); // Add the criteria
                  }
                }}
                placeholder="Press Enter to add a new criteria"
                InputProps={{
                  startAdornment: item.acceptanceCriterias && item.acceptanceCriterias.length > 0 ? (
                    <div className="flex gap-x-2" style={{ marginTop: '6px' }}>
                      {item.acceptanceCriterias.map((criteria, i) => (
                        <Chip
                          key={i}
                          label={criteria}
                          onDelete={() => handleDeleteAcceptanceCriteria(index, criteria)}
                          style={{ marginRight: 4 }}
                        />
                      ))}
                    </div>
                  ) : null,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.done || false}
                    onChange={(e) => handleWorkItemChange(index, 'done', e.target.checked)}
                    color="primary"
                  />
                }
                label="Done"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '-5px' }}>
            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={formValues.persons}
                getOptionLabel={(person) => {
                  const roleName = person.roleID > formValues.scrumRoles.length 
                    ? formValues.scrumRoles[person.roleID - formValues.scrumRoles.length - 1]?.roleName 
                    : formValues.scrumRoles[person.roleID - 1]?.roleName;
            
                  return `${person.firstName} ${person.lastName} (${roleName})`;
                }}
                value={item.workingPersons}
                onChange={(e, newValue) => handleWorkItemChange(index, 'workingPersons', newValue)}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Working Persons" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                label="Timebox"
                value={item.TimeboxDtoID}
                onChange={(e) => handleWorkItemChange(index, 'TimeboxDtoID', e.target.value)}
                fullWidth
              >
                <MenuItem key="none" value={null}>
                  None
                </MenuItem>

                {formValues.timeboxes.map((timebox, i) => (
                  <MenuItem key={i} value={i}>
                    {timebox.timeboxDescription} ({timebox.duration}h)
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Deadline"
                variant="outlined"
                type="date"
                value={item.deadline}
                onChange={(e) => handleWorkItemChange(index, 'deadline', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={addWorkItem}>
        Add Work Item
      </Button>
    </Box>
  );
};

export default StepWorkItems;
