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
    Box,
    ListItemSecondaryAction
} from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts/PieChart';
import { GlobalContext } from '../context/GlobalContext';
import { TeamContext } from '../context/TeamContext';
import logo from '../logo.png'; // Importing logo

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
        <Box style={{ padding: '20px' }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={logo} alt="Team Logo" style={{ maxWidth: '150px' }} />
            </div>

            <Typography variant="h4" gutterBottom>
                Team {selectedTeam} Dashboard
            </Typography>

            <Grid container spacing={3} alignItems="stretch">
                {/* Product Goal */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Product Goal
                            </Typography>
                            {teamData?.productGoal ? (
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

                {/* Tests Passed - Gauge */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Tests Passed
                            </Typography>
                            <Gauge
                            value={teamData?.evaluation?.tests?.filter(test => test.passed).length || 0}
                             startAngle={-110}
                             endAngle={110}
                            valueMax={teamData?.evaluation?.tests?.length}
                            sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                  fontSize: 30,
                                  transform: 'translate(0px, 0px)',
                                },
                              }}
                              text={
                                ({ value, valueMax }) => `${value} / ${valueMax}`
                             }
                             style={{ height: '130px', width: '100%' }}  // Add explicit height and width
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Problems Overview - Pie Chart */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Problems Overview
                            </Typography>
                            <Box
                                display="flex"
                                justifyContent="flex-start"  // Align content to the left
                                sx={{ ml: -10 }}  // Move the chart to the left with negative margin
                            >
                                <PieChart
                                    colors={['green', 'blue', 'red']}
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: teamData?.evaluation?.tests?.filter(test => test.severityLevel === 1).length || 0, label: 'Minor Problem' },
                                                { id: 1, value: teamData?.evaluation?.tests?.filter(test => test.severityLevel === 2).length || 0, label: 'Major Problem' },
                                                { id: 2, value: teamData?.evaluation?.tests?.filter(test => test.severityLevel === 3).length || 0, label: 'Critical Problem' },
                                            ],
                                            highlightScope: { fade: 'global', highlight: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        },
                                    ]}
                                    height={130}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Product Backlog */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Product Backlog
                            </Typography>
                            {Array.isArray(teamData?.productBacklog?.backlogItems) && teamData.productBacklog.backlogItems.length > 0 ? (
                                <List>
                                    {teamData.productBacklog.backlogItems
                                        .sort((a, b) => {
                                            // First, prioritize active items over inactive ones
                                            if (a.active && !b.active) return -1;
                                            if (!a.active && b.active) return 1;
                                            // Then, sort by itemPriority (null values go last)
                                            if (a.itemPriority === null) return 1;
                                            if (b.itemPriority === null) return -1;
                                            return a.itemPriority - b.itemPriority;
                                        })
                                        .map((item) => (
                                            <ListItem key={item.backlogItemID}>
                                                <ListItemText
                                                    primary={`${item.itemName}`}
                                                    secondary={
                                                        <>
                                                            <Typography component="span" variant="body2" color="textPrimary">
                                                                {item.itemDescription}
                                                            </Typography>
                                                            <br />
                                                            <Typography component="span" variant="body2">
                                                                Priority: {item.itemPriority !== null ? item.itemPriority : 'None'}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <Typography
                                                        variant="body2"
                                                        color={item.active ? 'green' : 'textSecondary'}
                                                    >
                                                        {item.active ? 'Active' : 'Done'}
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                </List>
                            ) : (
                                <Typography variant="body2">
                                    No backlog items found.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sprints */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Sprints Overview
                            </Typography>
                            {Array.isArray(teamData?.sprints) && teamData.sprints.length > 0 ? (
                                <List>
                                    {teamData.sprints
                                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))  // Sort newest first
                                        .map((sprint, index, sprintsArray) => (
                                            <ListItem key={sprint.sprintID}>
                                                <ListItemText
                                                    primary={`Sprint ${sprintsArray.length - index}`}  // Oldest sprint is Sprint 1
                                                    secondary={
                                                        <>
                                                            <Typography component="span" variant="body2" color="textPrimary">
                                                                Goal: {sprint.sprintGoal?.description || 'No goal assigned'}
                                                            </Typography>
                                                            <br />
                                                            <Typography component="span" variant="body2">
                                                                Start Date: {new Date(sprint.startDate).toLocaleDateString()}
                                                            </Typography>
                                                            <br />
                                                            <Typography component="span" variant="body2">
                                                                End Date: {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString() : 'Ongoing'}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                </List>
                            ) : (
                                <Typography variant="body2">
                                    No sprints found.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>


                {/* Team Members */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Team Members
                            </Typography>
                            {Array.isArray(teamData?.persons) && teamData.persons.length > 0 ? (
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
            </Grid>
        </Box>
    );
};

export default TeamDashboardPage;
