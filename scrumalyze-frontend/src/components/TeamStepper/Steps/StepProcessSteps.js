import React, { useContext, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { GlobalContext } from '../../../context/GlobalContext';

const StepProcessSteps = ({ formValues, handleChange }) => {
  const { processStepTypes, scrumRoles } = useContext(GlobalContext);

  useEffect(() => {
    if (
      !Array.isArray(formValues.processSteps) ||
      formValues.processSteps.length !== processStepTypes.length
    ) {
      const defaultSteps = processStepTypes.map((stepType) => ({
        id: stepType.processStepTypeID, // process step IDs start at 1
        timeboxID: null,
        guidedByPersonID: '',
        reviewsIncrement: false,
        updatesProductBacklog: false,
        adjustsProductGoal: false,
        createsSprintGoal: false,
        improvesSprint: false,
        averageDays: '',
        averageHours: '',
        averageMinutes: ''
      }));

      // Use handleChange to update formValues in parent
      handleChange('processSteps', defaultSteps);
    }
  }, [processStepTypes, formValues.processSteps, handleChange]);

  // Helper to update a single field of a given process step.
  // The index will be derived from processStepTypeID - 1.
  const handleStepFieldChange = (index, field, value) => {
    // For duration fields, enforce positive integer conversion
    if (['averageDays', 'averageHours', 'averageMinutes'].includes(field)) {
      const intVal = parseInt(value, 10);
      value = isNaN(intVal) || intVal < 0 ? '' : intVal;
    }
    const updated = formValues.processSteps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    handleChange('processSteps', updated);
  };

  // If processSteps hasn't been initialized yet, skip rendering until it is.
  if (!Array.isArray(formValues.processSteps)) {
    return null;
  }

  return (
    <Box>
      {processStepTypes.map((stepType) => {
        // Use the process step ID to derive the index: subtract 1.
        const idx = stepType.processStepTypeID - 1;
        const stepValues = formValues.processSteps[idx] || {};

        return (
          <Box key={stepType.processStepTypeID} sx={{ mb: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ marginBottom: '-20px' }}>
                <h3>
                  {stepType.processStepTypeID}. {stepType.processStepName}
                </h3>
              </Grid>

              {/* TimeboxID field */}
              <Grid item xs={4}>
                <TextField
                  select
                  label="Timebox"
                  value={stepValues.timeboxID ?? ''}
                  onChange={(e) =>
                    handleStepFieldChange(idx, 'timeboxID', e.target.value)
                  }
                  fullWidth
                >
                  <MenuItem key="none" value={null}>
                    None
                  </MenuItem>
                  {formValues.timeboxes.map((timebox, idx) => (
                    <MenuItem key={idx} value={idx}>
                      {timebox.timeboxDescription +
                        " (" +
                        timebox.duration +
                        " work hours)"}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* GuidedByPersonID field */}
              <Grid item xs={4}>
                <TextField
                  select
                  label="Guided By Person"
                  variant="outlined"
                  fullWidth
                  value={stepValues.guidedByPersonID ?? ''}
                  onChange={(e) =>
                    handleStepFieldChange(idx, 'guidedByPersonID', e.target.value)
                  }
                  required
                >
                  <MenuItem key="wholeTeam" value={"The Whole Team"}>
                    The Whole Team
                  </MenuItem>
                  {formValues.persons.map((person, i) => (
                    <MenuItem key={i} value={i}>
                      {person.firstName} {person.lastName} (
                      {(person.roleID - scrumRoles.length > 0
                        ? formValues.scrumRoles[person.roleID - scrumRoles.length - 1].roleName
                        : scrumRoles[person.roleID - 1].roleName)}
                      )
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Average Duration fields split into Days, Hours, Minutes */}
              <Grid item xs={4}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <TextField
                      label="Days"
                      variant="outlined"
                      type="number"
                      value={stepValues.averageDays}
                      onChange={(e) =>
                        handleStepFieldChange(idx, 'averageDays', e.target.value)
                      }
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
                      value={stepValues.averageHours}
                      onChange={(e) =>
                        handleStepFieldChange(idx, 'averageHours', e.target.value)
                      }
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
                      value={stepValues.averageMinutes}
                      onChange={(e) =>
                        handleStepFieldChange(idx, 'averageMinutes', e.target.value)
                      }
                      fullWidth
                      required
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stepValues.reviewsIncrement || false}
                      onChange={(e) =>
                        handleStepFieldChange(idx, 'reviewsIncrement', e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Reviews Increment"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stepValues.updatesProductBacklog || false}
                      onChange={(e) =>
                        handleStepFieldChange(idx, 'updatesProductBacklog', e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Updates Product Backlog"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stepValues.adjustsProductGoal || false}
                      onChange={(e) =>
                        handleStepFieldChange(idx, 'adjustsProductGoal', e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Adjusts Product Goal"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stepValues.createsSprintGoal || false}
                      onChange={(e) =>
                        handleStepFieldChange(idx, 'createsSprintGoal', e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Creates Sprint Goal"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stepValues.improvesSprint || false}
                      onChange={(e) =>
                        handleStepFieldChange(idx, 'improvesSprint', e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Improves Sprint"
                />
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default StepProcessSteps;
