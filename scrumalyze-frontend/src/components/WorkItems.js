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
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext';
import AssignedPersons from './AssignedPersons.js';

const WorkItems = () => {
    const { teamData, loading } = useContext(TeamContext);
    const { workItemTypes } = useContext(GlobalContext);

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
                const acceptanceCriterias = teamData.acceptanceCriteria.find(ac => ac.acceptanceCriteriaID === workItem.acceptanceCriteriaID);
                const definitionsOfDone = teamData.dodList.find(dod => dod.definitionOfDoneID === workItem.definitionOfDoneID);
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
                                {workItem.deadline ?
                                <Typography variant="body2" color="textSecondary">
                                    Deadline:  {new Date(workItem.deadline).toLocaleDateString()}
                                </Typography>
                                 : ''}


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

                                {/* Acceptance Criteria Section */}
                                {Array.isArray(teamData.acceptanceCriteria) && teamData.acceptanceCriteria.length > 0 && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle2" color="textPrimary">
                                            Acceptance Criteria
                                        </Typography>
                                        <List dense>
                                            {teamData.acceptanceCriteria.map((criteria) => (
                                                <ListItem
                                                    key={criteria.acceptanceCriteriaID}
                                                    sx={{
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                    }}
                                                >
                                                    <ListItemText primary={criteria.constraintDescription} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )}

                                {/* Definition of Done Section */}
                                {Array.isArray(teamData.dodList) && teamData.dodList.length > 0 && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle2" color="textPrimary">
                                            Definition of Done
                                        </Typography>
                                        <List dense>
                                            {teamData.dodList.map((dod) => (
                                                <ListItem
                                                    key={dod.definitionOfDoneID}
                                                    sx={{
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                    }}
                                                >
                                                    <ListItemText primary={dod.constraintDescription} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )}

                                {
                                    <AssignedPersons 
                                        workItemPersons={workItem.persons} 
                                        persons={teamData.persons} 
                                    />
                                }

                            </CardContent>
                            <CardActions sx={{ mt: 'auto' }}>
                                <Chip label={workItem.done ? 'Done' : 'In Progress'} color={workItem.done ? 'success' : 'warning'} />
                            </CardActions>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default WorkItems;
