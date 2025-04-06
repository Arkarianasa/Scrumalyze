import React, { useContext } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { GlobalContext } from '../../../context/GlobalContext';

const StepProductBacklog = ({ formValues, handleChange }) => {
    const { scrumRoles, prioritizationSchemes } = useContext(GlobalContext);

    return (
        <Box>
            {/* Dropdown for Product Goals */}
            <TextField
                style={{ marginBottom: '20px' }}
                select
                label="Related Product Goal"
                variant="outlined"
                fullWidth
                value={formValues.productBacklog.productGoalID}
                onChange={(e) =>
                    handleChange('productBacklog', {
                        ...formValues.productBacklog,
                        productGoalID: e.target.value,
                    })
                }
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

            {/* Dropdown for Responsible Person */}
            <TextField
                style={{ marginBottom: '20px' }}
                select
                label="Responsible Person"
                variant="outlined"
                fullWidth
                value={formValues.productBacklog.responsiblePersonDtoID}
                onChange={(e) =>
                    handleChange('productBacklog', {
                        ...formValues.productBacklog,
                        responsiblePersonDtoID: e.target.value,
                    })
                }
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

            {/* Dropdown for Primary Prioritization Scheme */}
            <TextField
                style={{ marginBottom: '20px' }}
                select
                label="Primary Prioritization Scheme"
                variant="outlined"
                fullWidth
                value={formValues.productBacklog.primaryPrioritizationSchemeID}
                onChange={(e) =>
                    handleChange('productBacklog', {
                        ...formValues.productBacklog,
                        primaryPrioritizationSchemeID: e.target.value,
                    })
                }
            >
                <MenuItem value={null}>
                    None
                </MenuItem>
                {prioritizationSchemes.map((scheme, index) => (
                    <MenuItem key={index} value={scheme.prioritizationSchemeID}>
                        {scheme.schemeName}{' '}
                        {scheme.prioritizationLevels.length > 0
                            ? `[${scheme.prioritizationLevels.map(level => level.levelName).join(', ')}]`
                            : ''}
                    </MenuItem>
                ))}
            </TextField>

            {/* Dropdown for Secondary Prioritization Scheme */}
            {formValues.productBacklog.primaryPrioritizationSchemeID && (
                <TextField
                    style={{ marginBottom: '20px' }}
                    select
                    label="Secondary Prioritization Scheme"
                    variant="outlined"
                    fullWidth
                    value={formValues.productBacklog.secondaryPrioritizationSchemeID}
                    onChange={(e) =>
                        handleChange('productBacklog', {
                            ...formValues.productBacklog,
                            secondaryPrioritizationSchemeID: e.target.value,
                        })
                    }
                >
                    <MenuItem value={null}>None</MenuItem>
                    {prioritizationSchemes.map((scheme, index) => (
                        <MenuItem key={index} value={scheme.prioritizationSchemeID}>
                            {scheme.schemeName}{' '}
                            {scheme.prioritizationLevels.length > 0
                                ? `[${scheme.prioritizationLevels
                                      .map((level) => level.levelName)
                                      .join(', ')}]`
                                : ''}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        </Box>
    );
};

export default StepProductBacklog;
