// StepTeamRoles.js
import React, { useContext } from 'react';
import { Box, Grid, TextField, Button } from '@mui/material';
import { GlobalContext } from '../../../context/GlobalContext';

const StepTeamRoles = ({ formValues, handleChange }) => {
  const { scrumRoles } = useContext(GlobalContext);

  const handleRoleChange = (index, field, value) => {
    const updatedRoles = formValues.scrumRoles.map((role, i) =>
      i === index ? { ...role, [field]: value } : role
    );
    handleChange('scrumRoles', updatedRoles);
  };

  return (
    <Box>
      {/* Predefined roles from GlobalContext */}
      {scrumRoles.map((role, index) => (
        <Grid container spacing={2} key={index} style={{ marginBottom: '20px', alignItems: 'center' }}>
          <Grid item xs={4}>
            <TextField
              label="Role Name"
              variant="outlined"
              value={role.roleName}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Role Description"
              variant="outlined"
              value={role.roleDescription}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>
      ))}

      {/* Editable roles */}
      {formValues.scrumRoles.map((role, index) => (
        <Grid container spacing={2} key={index} style={{ marginBottom: '20px', alignItems: 'center' }}>
          <Grid item xs={4}>
            <TextField
              label="Role Name"
              variant="outlined"
              value={role.roleName}
              onChange={(e) => handleRoleChange(index, 'roleName', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={7}>
            <TextField
              label="Role Description"
              variant="outlined"
              value={role.roleDescription}
              onChange={(e) => handleRoleChange(index, 'roleDescription', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                handleChange('scrumRoles', formValues.scrumRoles.filter((_, i) => i !== index))
              }
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          handleChange('scrumRoles', [
            ...formValues.scrumRoles,
            { roleName: '', roleDescription: '' }
          ])
        }
      >
        Add Role
      </Button>
    </Box>
  );
};

export default StepTeamRoles;
