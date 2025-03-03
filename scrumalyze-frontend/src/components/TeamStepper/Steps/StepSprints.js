import React, {useContext} from 'react';
import { Box, Grid, TextField, MenuItem, Button, Autocomplete } from '@mui/material';
import { GlobalContext } from '../../../context/GlobalContext';

const StepSprints = ({ formValues, handleChange }) => {
    const { scrumRoles } = useContext(GlobalContext);

    const handleSprintChange = (index, field, value) => {
        const updatedSprints = formValues.sprints.map((sprint, i) =>
            i === index ? { ...sprint, [field]: value } : sprint
        );
        handleChange('sprints', updatedSprints);
    };

    const handleDeleteSprint = (index) => {
        const updatedSprints = formValues.sprints.filter((_, i) => i !== index);
        handleChange('sprints', updatedSprints);
    };

    const addSprint = () => {
        const newSprint = {
            sprintGoal: '',
            goalResponsiblePersonID: '',
            startDate: '',
            endDate: '',
            TimeboxDtoID: '',
            backlogItems: [],
            backlogResponsiblePersonID: '',
        };
        handleChange('sprints', [...formValues.sprints, newSprint]);
    };

    return (
        <Box>
            {formValues.sprints.map((sprint, index) => (
                <Box key={index} style={{ marginBottom: '40px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                select
                                label="Related Product Goal"
                                variant="outlined"
                                fullWidth
                                value={sprint.productGoalID}
                                onChange={(e) => handleSprintChange(index, 'productGoalID', e.target.value)}
                            >
                                <MenuItem value={null}>
                                    None
                                </MenuItem>

                                {formValues.productGoals.map((goal, index) => (
                                    <MenuItem key={index} value={index}>
                                        {goal.description}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                select
                                label="Timebox"
                                value={sprint.TimeboxDtoID}
                                onChange={(e) => handleSprintChange(index, 'TimeboxDtoID', e.target.value)}
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
                        <Grid item xs={2}>
                            <TextField
                                label="Start Date"
                                variant="outlined"
                                type="date"
                                value={sprint.startDate}
                                onChange={(e) => handleSprintChange(index, 'startDate', e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                label="End Date"
                                variant="outlined"
                                type="date"
                                value={sprint.endDate}
                                onChange={(e) => handleSprintChange(index, 'endDate', e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteSprint(index)}
                                fullWidth
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} style={{ marginTop: '0px' }}>
                        <Grid item xs={9}>
                            <TextField
                                label="Sprint Goal"
                                variant="outlined"
                                value={sprint.sprintGoal}
                                onChange={(e) => handleSprintChange(index, 'sprintGoal', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                select
                                label="Sprint Goal Responsible Person"
                                variant="outlined"
                                fullWidth
                                value={sprint.goalResponsiblePersonID}
                                onChange={(e) => handleSprintChange(index, 'goalResponsiblePersonID', e.target.value)}
                                required
                            >
                                <MenuItem key="wholeTeam" value={"The Whole Team"}>
                                    Whole Team
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
                    </Grid>

                    <Grid container spacing={2} style={{ marginTop: '0px' }}>
                        <Grid item xs={9}>
                            <Autocomplete
                                multiple
                                options={formValues.backlogItems}
                                getOptionLabel={(option) => option.itemName}
                                value={formValues.backlogItems.filter((_, i) => sprint.backlogItems.includes(i))}
                                onChange={(e, newValue) => {
                                    const selectedIndexes = newValue.map((item) =>
                                        formValues.backlogItems.indexOf(item)
                                    );
                                    handleSprintChange(index, 'backlogItems', selectedIndexes);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Select Sprint Backlog Items"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                select
                                label="Sprint Backlog Responsible Person"
                                variant="outlined"
                                fullWidth
                                value={sprint.backlogResponsiblePersonID}
                                onChange={(e) => handleSprintChange(index, 'backlogResponsiblePersonID', e.target.value)}
                                required
                            >
                                <MenuItem key="wholeTeam" value={"The Whole Team"}>
                                    Whole Team
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
                    </Grid>
                </Box>
            ))}
            <Button variant="contained" color="primary" onClick={addSprint}>
                Add Sprint
            </Button>
        </Box>
    );
};

export default StepSprints;
