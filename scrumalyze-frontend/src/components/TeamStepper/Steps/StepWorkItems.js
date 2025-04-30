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
    const updated = formValues.workItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleChange('workItems', updated);
  };

  const handleDeleteWorkItem = (index) => {
    const filtered = formValues.workItems.filter((_, i) => i !== index);
    handleChange('workItems', filtered);
  };

  const addWorkItem = () => {
    const newItem = {
      description: '',
      BacklogItemDtoID: null,
      workItemTypeID: null,
      definitionOfDoneIDs: [],
      acceptanceCriterias: [],
      done: false,
      workingPersonIds: [],  // only store IDs (indices) here
      TimeboxDtoID: null,
      deadline: ''
    };
    handleChange('workItems', [...formValues.workItems, newItem]);
  };

  const formatTimeboxDuration = (tb) => {
    const { days = 0, hours = 0, minutes = 0 } = tb;
    const parts = [];
    if (days) parts.push(`${days} work day${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    return parts.length ? parts.join(', ') : '0 hours';
  };

  const handleAddAcceptanceCriteria = (idx, criteria) => {
    const updated = formValues.workItems.map((item, i) =>
      i === idx
        ? { ...item, acceptanceCriterias: [...(item.acceptanceCriterias || []), criteria] }
        : item
    );
    setAcceptanceCriteriaInputs(prev => ({ ...prev, [idx]: '' }));
    handleChange('workItems', updated);
  };

  const handleInputChange = (idx, value) => {
    setAcceptanceCriteriaInputs(prev => ({ ...prev, [idx]: value }));
  };

  const handleDeleteAcceptanceCriteria = (idx, crit) => {
    const updated = formValues.workItems.map((item, i) =>
      i === idx
        ? { ...item, acceptanceCriterias: item.acceptanceCriterias.filter(c => c !== crit) }
        : item
    );
    handleChange('workItems', updated);
  };

  return (
    <Box>
      {formValues.workItems.map((item, index) => (
        <Box key={index} mb={4}>
          {/* Row 1: Description, Backlog, Type, Delete */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Description"
                value={item.description}
                onChange={e => handleWorkItemChange(index, 'description', e.target.value)}
                fullWidth required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                select label="Backlog Item"
                value={item.BacklogItemDtoID}
                onChange={e => handleWorkItemChange(index, 'BacklogItemDtoID', e.target.value)}
                fullWidth
              >
                <MenuItem value={null}>None</MenuItem>
                {formValues.backlogItems.map((b, i) => (
                  <MenuItem key={i} value={i}>{b.itemName}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                select label="Work Item Type"
                value={item.workItemTypeID}
                onChange={e => handleWorkItemChange(index, 'workItemTypeID', e.target.value)}
                fullWidth
              >
                <MenuItem value={null}>None</MenuItem>
                {workItemTypes.map(type => (
                  <MenuItem key={type.workItemTypeID} value={type.workItemTypeID}>{type.typeName}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={1}>
              <Button color="error" onClick={() => handleDeleteWorkItem(index)}>Delete</Button>
            </Grid>
          </Grid>

          {/* Row 2: DoD & Acceptance Criteria */}
          <Grid container spacing={2} mt={-1}>
            <Grid item xs={5}>
              <Autocomplete
                multiple
                options={formValues.definitionsOfDone}
                getOptionLabel={dod => dod.constraintDescription}
                value={item.definitionOfDoneIDs.map(i => formValues.definitionsOfDone[i])}
                onChange={(_, newVals) => {
                  const ids = newVals.map(d => formValues.definitionsOfDone.indexOf(d));
                  handleWorkItemChange(index, 'definitionOfDoneIDs', ids);
                }}
                renderInput={params => <TextField {...params} label="Definitions of Done" fullWidth />}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Acceptance Criteria"
                value={acceptanceCriteriaInputs[index] || ''}
                onChange={e => handleInputChange(index, e.target.value)}
                fullWidth
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value.trim()) handleAddAcceptanceCriteria(index, e.target.value.trim());
                }}
                placeholder="Type and press Enter"
                InputProps={{
                  startAdornment: item.acceptanceCriterias.length ? (
                    <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
                      {item.acceptanceCriterias.map((c, i) => (
                        <Chip key={i} label={c} onDelete={() => handleDeleteAcceptanceCriteria(index, c)} />
                      ))}
                    </Box>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={<Checkbox checked={item.done} onChange={e => handleWorkItemChange(index, 'done', e.target.checked)} />}
                label="Done"
              />
            </Grid>
          </Grid>

          {/* Row 3: Assigned Persons, Timebox, Deadline */}
          <Grid container spacing={2} mt={-1}>
            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={formValues.persons}
                getOptionLabel={person => {
                  const roleIndex = person.roleID - 1;
                  const roleName = roleIndex < scrumRoles.length
                    ? scrumRoles[roleIndex].roleName
                    : formValues.scrumRoles[roleIndex - scrumRoles.length].roleName;
                  return `${person.firstName} ${person.lastName} (${roleName})`;
                }}
                value={(item.workingPersonIds || [])
                  .map(id => formValues.persons[id])
                  .filter(Boolean)
                }
                onChange={(_, newVals) => {
                  const indices = newVals.map(p => formValues.persons.indexOf(p));
                  handleWorkItemChange(index, 'workingPersonIds', indices);
                }}
                renderInput={params => <TextField {...params} label="Assigned Persons" fullWidth />}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select label="Timebox"
                value={item.TimeboxDtoID}
                onChange={e => handleWorkItemChange(index, 'TimeboxDtoID', e.target.value)}
                fullWidth
              >
                <MenuItem value={null}>None</MenuItem>
                {formValues.timeboxes.map((tb, i) => (
                  <MenuItem key={i} value={i}>{`${tb.timeboxDescription} (${formatTimeboxDuration(tb)})`}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Deadline"
                type="date"
                value={item.deadline || ''}
                onChange={e => handleWorkItemChange(index, 'deadline', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button variant="contained" onClick={addWorkItem}>Add Work Item</Button>
    </Box>
  );
};

export default StepWorkItems;
