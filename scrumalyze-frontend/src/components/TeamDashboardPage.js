import React, { useContext } from 'react';
import {
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
} from '@mui/material';
import { GlobalContext } from '../context/GlobalContext';
import { TeamContext } from '../context/TeamContext';

const TeamDashboardPage = () => {
    const { selectedTeam } = useContext(GlobalContext);
    const { teamData, loading } = useContext(TeamContext);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Team {selectedTeam} Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Team Members */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Team Members
                            </Typography>
                            {Array.isArray(teamData.persons) && teamData.persons.length > 0 ? (
                                <List>
                                    {teamData.persons.map((person) => (
                                        <ListItem key={person.personID}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {person.firstName.charAt(0)}
                                                    {person.lastName.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${person.firstName} ${person.lastName}`}
                                                secondary={person.role ? person.role.roleName : 'No role assigned'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2">
                                    No team members found.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Product Goal */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Product Goal
                            </Typography>
                            {teamData.productGoal ? (
                                <>
                                    <Typography variant="body1">
                                        {teamData.productGoal.description}
                                    </Typography>
                                    <Divider style={{ margin: '10px 0' }} />
                                    <Typography variant="body2">
                                        Created on: {new Date(teamData.productGoal.createdDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Created by: {`${teamData.productGoal.createdByPerson.firstName} ${teamData.productGoal.createdByPerson.lastName}`}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2">
                                    No product goal found.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default TeamDashboardPage;
