// StepTeamRoles.js
import React, { useContext } from 'react';
import { Box, Grid, TextField, Button, MenuItem, Typography } from '@mui/material';
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
            {scrumRoles.map((role, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px', alignItems: 'center' }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Role Name"
                            variant="outlined"
                            value={role.roleName}
                            fullWidth
                            disabled
                        />
                    </Grid>
                </Grid>
            ))}
            {formValues.scrumRoles.map((role, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '20px', alignItems: 'center' }}>
                    <Grid item xs={11}>
                        <TextField
                            label="Role Name"
                            variant="outlined"
                            value={role.roleName}
                            onChange={(e) => handleRoleChange(index, 'roleName', e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleChange('scrumRoles', formValues.scrumRoles.filter((_, i) => i !== index))}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            ))}

            <Button
                variant="contained"
                color="primary"
                onClick={() => handleChange('scrumRoles', [...formValues.scrumRoles, { roleName: '', roleDescription: '' }])}
            >
                Add Role
            </Button>

        </Box>
    );
};

export default StepTeamRoles;
