import React, { useContext } from 'react';
import {
    CircularProgress,
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    Grid,
    Chip,
} from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext';
import AssignedPersons from './AssignedPersons.js';

const WorkItems = () => {
    const { teamData, loading } = useContext(TeamContext);
    const { workItemTypes } = useContext(GlobalContext);


    console.log(teamData.workItems);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={3} sx={{ padding: 2 }}>
            {teamData.workItems.map((workItem) => {
                const workItemType = workItemTypes.find(type => type.workItemTypeID === workItem.workItemTypeID);
                const acceptanceCriteria = teamData.acceptanceCriteria.find(ac => ac.acceptanceCriteriaID === workItem.acceptanceCriteriaID);
                const definitionOfDone = teamData.dodList.find(dod => dod.definitionOfDoneID === workItem.definitionOfDoneID);
                const timebox = teamData.timeboxes.find(tb => tb.timeboxID === workItem.timeboxID);

                return (
                    <Grid item xs={12} sm={6} md={4} key={workItem.workItemID}>
                        <Card variant="outlined" sx={{ minHeight: '300px', display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1, overflow: 'auto' }}>
                            <CardContent>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    {workItem.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Type: {workItemType ? workItemType.typeName : 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Deadline: {workItem.deadline ? new Date(workItem.deadline).toLocaleDateString() : 'None'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Status: {workItem.done ? 'Done' : 'In Progress'}
                                </Typography>

                                {acceptanceCriteria && (
                                    <Box mt={1}>
                                        <Typography variant="subtitle2" color="textPrimary">
                                            Acceptance Criteria
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {acceptanceCriteria.constraintDescription}
                                        </Typography>
                                    </Box>
                                )}

                                {definitionOfDone && (
                                    <Box mt={1}>
                                        <Typography variant="subtitle2" color="textPrimary">
                                            Definition of Done
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {definitionOfDone.constraintDescription}
                                        </Typography>
                                    </Box>
                                )}

                                {timebox && (
                                    <Box mt={1}>
                                        <Typography variant="subtitle2" color="textPrimary">
                                            Timebox
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {timebox.timeboxDescription} - {timebox.duration} hours
                                        </Typography>
                                    </Box>
                                )}

                                {
                                    <AssignedPersons 
                                        personWorkItems={workItem.personWorkItems} 
                                        persons={teamData.persons} 
                                    />
                                }

                            </CardContent>
                            <CardActions sx={{ mt: 'auto' }}>
                                <Chip label={workItem.done ? 'Completed' : 'In Progress'} color={workItem.done ? 'success' : 'warning'} />
                            </CardActions>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default WorkItems;
