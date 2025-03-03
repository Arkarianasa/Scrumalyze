import React, { useContext } from 'react';
import { Box, Grid, TextField, Button, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { GlobalContext } from '../../../context/GlobalContext';

const StepInvolvedPersons = ({ formValues, handleChange }) => {
    const { scrumRoles } = useContext(GlobalContext);

    const handlePersonChange = (index, field, value) => {
        const updatedPersons = formValues.persons.map((person, i) =>
            i === index ? { ...person, [field]: value } : person
        );
        handleChange('persons', updatedPersons);
    };

    return (
        <Box>
            {formValues.persons.map((person, index) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '10px', alignItems: 'center' }}>
                    <Grid item xs={4}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            value={person.firstName}
                            onChange={(e) => handlePersonChange(index, 'firstName', e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            value={person.lastName}
                            onChange={(e) => handlePersonChange(index, 'lastName', e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            select
                            label="Role"
                            variant="outlined"
                            value={person.roleID}
                            onChange={(e) => handlePersonChange(index, 'roleID', e.target.value)}
                            fullWidth
                            required
                        >
                            {scrumRoles.map((role, idx) => (
                                <MenuItem key={idx} value={role.roleID}>
                                    {role.roleName}
                                </MenuItem>
                            ))}

                            {formValues.scrumRoles.map((customRole, idx) => (
                                <MenuItem key={idx + scrumRoles.length + 1} value={idx + scrumRoles.length + 1}>
                                    {customRole.roleName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={person.isScrumTeamMember || false}
                                    onChange={(e) => handlePersonChange(index, 'isScrumTeamMember', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="SCRUM Team Member"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() =>
                                handleChange('persons', formValues.persons.filter((_, i) => i !== index))
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
                    handleChange('persons', [
                        ...formValues.persons,
                        { firstName: '', lastName: '', roleID: null, isScrumTeamMember: false },
                    ])
                }
            >
                Add Person
            </Button>
        </Box>
    );
};

export default StepInvolvedPersons;
