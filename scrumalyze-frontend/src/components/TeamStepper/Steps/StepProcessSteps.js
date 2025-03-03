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

  // Initialize default processSteps if needed
  useEffect(() => {
    // If there's no processSteps array or the length doesn't match
    // the number of processStepTypes, initialize or re-initialize it.
    if (
      !Array.isArray(formValues.processSteps) ||
      formValues.processSteps.length !== processStepTypes.length
    ) {
      const defaultSteps = processStepTypes.map(() => ({
        timeboxID: null,
        guidedByPersonID: null,
        reviewsIncrement: false,
        updatesProductBacklog: false,
        adjustsProductGoal: false,
        createsSprintGoal: false,
        improvesSprint: false
      }));

      // Use handleChange to update formValues in parent
      handleChange('processSteps', defaultSteps);
    }
  }, [processStepTypes, formValues.processSteps, handleChange]);

  // Helper to update a single field of a given step in formValues.processSteps
  const handleStepFieldChange = (index, field, value) => {
    const updated = formValues.processSteps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    handleChange('processSteps', updated);
  };

  // If processSteps hasn't been initialized yet, skip rendering
  // until the effect sets it.
  if (!Array.isArray(formValues.processSteps)) {
    return null;
  }

  return (
    <Box>
      {processStepTypes.map((stepType, index) => {
        // Each process step type should correspond to an object in formValues.processSteps
        const stepValues = formValues.processSteps[index] || {};

        return (
          <Box key={stepType.processStepTypeID} sx={{ mb: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{marginBottom: '-20px'}}>
                <h3>{stepType.processStepName}</h3>
              </Grid>

              {/* TimeboxID field */}
              <Grid item xs={4}>
                <TextField
                    select
                    label="Timebox"
                    value={stepValues.timeboxID ?? ''}
                    onChange={(e) => handleStepFieldChange(index, 'timeboxID', e.target.value)}
                    fullWidth
                >
                    <MenuItem key="none" value={null}>
                        None
                    </MenuItem>

                    {formValues.timeboxes.map((timebox, idx) => (
                        <MenuItem key={idx} value={idx}>
                            {timebox.timeboxDescription + "(" + timebox.duration + " work hours)"}
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
                    onChange={(e) => handleStepFieldChange(index, 'guidedByPersonID', e.target.value)}
                    required
                >
                    <MenuItem key="wholeTeam" value={"The Whole Team"}>
                        Whole Teams
                    </MenuItem>
                    {formValues.persons.map((person, index) => (
                        <MenuItem key={index} value={index}>
                            {person.firstName} {person.lastName} (
                            {(person.roleID - scrumRoles.length > 0
                                ? formValues.scrumRoles[person.roleID - scrumRoles.length - 1].roleName
                                : scrumRoles[person.roleID - 1].roleName)}
                            )
                        </MenuItem>
                    ))}
                </TextField>
              </Grid>

              {/* AverageDuration field */}
              <Grid item xs={4}>
                  <TextField
                      label="Average duration in work hours"
                      variant="outlined"
                      value={stepValues.averageDuration}
                      onChange={(e) => handleStepFieldChange(index, 'averageDuration', e.target.value)}
                      fullWidth
                      required
                  />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stepValues.reviewsIncrement || false}
                      onChange={(e) =>
                        handleStepFieldChange(index, 'reviewsIncrement', e.target.checked)
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
                        handleStepFieldChange(
                          index,
                          'updatesProductBacklog',
                          e.target.checked
                        )
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
                        handleStepFieldChange(
                          index,
                          'adjustsProductGoal',
                          e.target.checked
                        )
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
                        handleStepFieldChange(
                          index,
                          'createsSprintGoal',
                          e.target.checked
                        )
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
                        handleStepFieldChange(
                          index,
                          'improvesSprint',
                          e.target.checked
                        )
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
