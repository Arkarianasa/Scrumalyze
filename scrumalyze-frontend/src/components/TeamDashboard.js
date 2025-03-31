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
    ListItemSecondaryAction,
    Button,
    Stack,
} from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts/PieChart';
import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext';

const TeamDashboard = () => {
    const { teamData, loading, setLoading, setTeamData } = useContext(TeamContext);
    const { prioritizationSchemes, selectedTeam } = useContext(GlobalContext);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    const handleRetakeTest = async () => {
        setLoading(true);
        try {    
            const response = await fetch(`https://localhost:52765/api/evaluation/${selectedTeam.scrumTeamID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to retake the test: ${response.statusText}`);
            }
    
            const updatedEvaluation = await response.json();
    
            setTeamData(prevState => ({
                ...prevState,
                evaluation: updatedEvaluation
            }));
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };    

    return (
        <Grid container spacing={1} alignItems="stretch">
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
                                        Owner:{" "}
                                        {teamData.productGoal.responsiblePerson
                                            ? `${teamData.productGoal.responsiblePerson.firstName} ${teamData.productGoal.responsiblePerson.lastName}`
                                            : "The Whole Team"}
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
                            {/* Stack for title, subtitle, and button in a row */}
                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                <div>
                                    <Typography variant="h5">
                                        SCRUM Evaluation
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {teamData.evaluation?.evaluatedOn
                                            ? "Evaluation from: " + new Date(teamData.evaluation.evaluatedOn).toLocaleString()
                                            : "Not yet evaluated"}
                                    </Typography>
                                </div>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="small"
                                    onClick={() => handleRetakeTest(teamData.ScrumTeamID, setLoading)}
                                >
                                    {teamData.evaluation?.evaluatedOn? "Retake evaluation" : "Evaluate SCRUM"}
                                    
                                </Button>
                            </Stack>

                            {/* Gauge component */}
                            {teamData.evaluation?.evaluatedOn? 
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
                                text={({ value, valueMax }) => `${value} / ${valueMax}`}
                                style={{ height: '130px', width: '100%' }}  
                            />
                            : ""}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Problems Overview - Pie Chart */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Detected Pathological Behaviours
                            </Typography>
                            <Typography variant="body2" color="textSecondary" >
                            {teamData.evaluation?.evaluatedOn
                                            ? "Evaluation from: " + new Date(teamData.evaluation.evaluatedOn).toLocaleString()
                                            : "Not yet evaluated"}
                            </Typography>
                            <Box
                                display="flex"
                                justifyContent="flex-start"  // Align content to the left
                                sx={{ mt: 1 }}  // Move the chart to the left with negative margin
                            >
                                {teamData.evaluation?.evaluatedOn? 
                                <PieChart
                                    colors={['#1976d2', '#f57c00', '#d32f2f']}
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: teamData?.evaluation?.tests?.filter(test => test.severity === 'Minor').length || 0, label: 'Minor' },
                                                { id: 1, value: teamData?.evaluation?.tests?.filter(test => test.severity === 'Major').length || 0, label: 'Major' },
                                                { id: 2, value: teamData?.evaluation?.tests?.filter(test => test.severity === 'Critical').length || 0, label: 'Critical' },
                                            ],
                                            highlightScope: { fade: 'global', highlight: 'item' },
                                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },

                                        },
                                    ]}
                                    height={130}
                                />
                                : ""}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Product Backlog */}
                <Grid item xs={12} sm={6} md={4} style={{ height: '550px' }}>
                    <Card style={{ height: '100%', flexGrow: 1, overflow: 'auto' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Product Backlog
                            </Typography>
                            <Typography variant="body2">
                                        Owner:{" "}
                                        {teamData.productBacklog.responsiblePerson
                                            ? `${teamData.productBacklog.responsiblePerson.firstName} ${teamData.productBacklog.responsiblePerson.lastName}`
                                            : "The Whole Team"}
                                    </Typography>
                            {Array.isArray(teamData?.productBacklog?.backlogItems) && teamData.productBacklog.backlogItems.length > 0 ? (
                                <List>
                                    {teamData.productBacklog.backlogItems
                                        .sort((a, b) => {
                                            // First, prioritize active items over inactive ones
                                            if (a.done && !b.done) return 1;
                                            if (!a.done && b.done) return -1;

                                            // Then, sort by primaryPriorityValue (null values go last)
                                            if (a.primaryPriorityValue === null) return 1;
                                            if (b.primaryPriorityValue === null) return -1;
                                            const primaryComparison = a.primaryPriorityValue - b.primaryPriorityValue;
                                            if (primaryComparison !== 0) return primaryComparison;

                                            // Lastly, sort by secondaryPriorityValue (null values go last)
                                            if (a.secondaryPriorityValue === null) return 1;
                                            if (b.secondaryPriorityValue === null) return -1;
                                            return a.secondaryPriorityValue - b.secondaryPriorityValue;
                                        })
                                        .map((item) => {
                                            const primaryScheme = prioritizationSchemes.find(
                                                (scheme) => scheme.prioritizationSchemeID === teamData.productBacklog.primaryPrioritizationSchemeID
                                            );

                                            const secondaryScheme = prioritizationSchemes.find(
                                                (scheme) => scheme.prioritizationSchemeID === teamData.productBacklog.secondaryPrioritizationSchemeID
                                            );

                                            let primaryPriorityDisplay;
                                            if (primaryScheme) {
                                                if (primaryScheme.schemeName === "Numerical Ranking") {
                                                    primaryPriorityDisplay = item.primaryPriorityValue !== null ? item.primaryPriorityValue : "None";
                                                } else {
                                                    const level = primaryScheme.prioritizationLevels.find(
                                                        (level) => level.levelValue === item.primaryPriorityValue
                                                    );
                                                    primaryPriorityDisplay = level ? level.levelName : "None";
                                                }
                                            } else {
                                                primaryPriorityDisplay = "None";
                                            }

                                            let secondaryPriorityDisplay;
                                            if (secondaryScheme) {
                                                if (secondaryScheme.schemeName === "Numerical Ranking") {
                                                    secondaryPriorityDisplay = item.secondaryPriorityValue !== null ? item.secondaryPriorityValue : "None";
                                                } else {
                                                    const level = secondaryScheme.prioritizationLevels.find(
                                                        (level) => level.levelValue === item.secondaryPriorityValue
                                                    );
                                                    secondaryPriorityDisplay = level ? level.levelName : "None";
                                                }
                                            } else {
                                                secondaryPriorityDisplay = "None";
                                            }

                                            return (
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
                                                                    Primary Priority: {primaryPriorityDisplay}
                                                                </Typography>
                                                                <br />
                                                                <Typography component="span" variant="body2">
                                                                    Secondary Priority: {secondaryPriorityDisplay}
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Typography
                                                            variant="body2"
                                                            color={!item.done ? "green" : "textSecondary"}
                                                        >
                                                            {!item.done ? "Active" : "Done"}
                                                        </Typography>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            );
                                        })}
                                </List>
                            ) : (
                                <Typography variant="body2">No backlog items found.</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sprints */}
                <Grid item xs={12} sm={6} md={4} style={{ height: '550px' }}>
                    <Card style={{ height: '100%', flexGrow: 1, overflow: 'auto' }}>
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
                <Grid item xs={12} sm={6} md={4} style={{ height: '550px' }}>
                    <Card style={{ height: '100%', flexGrow: 1, overflow: 'auto' }}>
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
    );
};

export default TeamDashboard;