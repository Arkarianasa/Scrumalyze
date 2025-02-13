import React, { useContext } from 'react';
import { Box, TextField, Grid, Checkbox, Button, FormControlLabel, MenuItem } from '@mui/material';
import { GlobalContext } from '../../../context/GlobalContext';

const StepProductBacklogSample = ({ formValues, handleChange }) => {
  const { prioritizationSchemes } = useContext(GlobalContext);

  const primaryScheme = prioritizationSchemes.find(
    (scheme) => scheme.prioritizationSchemeID === formValues.productBacklog.primaryPrioritizationSchemeID
  );
  const secondaryScheme = prioritizationSchemes.find(
    (scheme) => scheme.prioritizationSchemeID === formValues.productBacklog.secondaryPrioritizationSchemeID
  );

  const primaryLevels = primaryScheme?.prioritizationLevels || [];
  const secondaryLevels = secondaryScheme?.prioritizationLevels || [];

  const handleBacklogItemChange = (index, field, value) => {
    const updatedBacklogItems = formValues.backlogItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleChange('backlogItems', updatedBacklogItems);
  };

  return (
    <Box>
      {formValues.backlogItems.map((item, index) => (
        <Box key={index} style={{ marginBottom: '30px', alignItems: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={formValues.productBacklog.primaryPrioritizationSchemeID === null ? 10 : formValues.productBacklog.secondaryPrioritizationSchemeID === null ? 8 : 6}>
              <TextField
                label="Item Name"
                variant="outlined"
                value={item.itemName}
                onChange={(e) => handleBacklogItemChange(index, 'itemName', e.target.value)}
                fullWidth
                required
              />
            </Grid>

            {/* Primary Prioritization Scheme Dropdown or Number Input */}
            {formValues.productBacklog.primaryPrioritizationSchemeID !== null && (
              <Grid item xs={2}>
                {primaryLevels.length > 0 ? (
                  <TextField
                    label="Primary Priority"
                    variant="outlined"
                    select
                    value={item.primaryPriorityValue || null}
                    onChange={(e) => handleBacklogItemChange(index, 'primaryPriorityValue', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value={null}>None</MenuItem>
                    {primaryLevels.map((level) => (
                      <MenuItem key={level.levelValue} value={level.levelValue}>
                        {level.levelName}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    label="Primary Priority"
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={item.primaryPriorityValue || null}
                    onChange={(e) => handleBacklogItemChange(index, 'primaryPriorityValue', e.target.value)}
                    fullWidth
                  />
                )}
              </Grid>
            )}

            {/* Secondary Prioritization Scheme Dropdown or Number Input */}
            {formValues.productBacklog.secondaryPrioritizationSchemeID !== null && (
              <Grid item xs={2}>
                {secondaryLevels.length > 0 ? (
                  <TextField
                    label="Secondary Priority"
                    variant="outlined"
                    select
                    value={item.secondaryPriorityValue || null}
                    onChange={(e) => handleBacklogItemChange(index, 'secondaryPriorityValue', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value={null}>None</MenuItem>
                    {secondaryLevels.map((level) => (
                      <MenuItem key={level.levelValue} value={level.levelValue}>
                        {level.levelName}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    label="Secondary Priority"
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={item.secondaryPriorityValue || null}
                    onChange={(e) => handleBacklogItemChange(index, 'secondaryPriorityValue', e.target.value)}
                    fullWidth
                  />
                )}
              </Grid>
            )}

            <Grid item xs={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.done || false}
                    onChange={(e) => handleBacklogItemChange(index, 'done', e.target.checked)}
                    color="primary"
                  />
                }
                label="Done"
              />
            </Grid>

            <Grid item xs={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  handleChange(
                    'backlogItems',
                    formValues.backlogItems.filter((_, i) => i !== index)
                  )
                }
                fullWidth
              >
                Delete
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '-5px' }}>
            <Grid item xs={12}>
              <TextField
                label="Item Description"
                variant="outlined"
                value={item.itemDescription}
                onChange={(e) => handleBacklogItemChange(index, 'itemDescription', e.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          handleChange('backlogItems', [
            ...formValues.backlogItems,
            {
              itemName: '',
              itemDescription: '',
              primaryPriorityValue: null,
              secondaryPriorityValue: null,
              productBacklogID: 0,
              sprintBacklogID: null,
              done: false,
            },
          ])
        }
      >
        Add Backlog Item
      </Button>
    </Box>
  );
};

export default StepProductBacklogSample;
