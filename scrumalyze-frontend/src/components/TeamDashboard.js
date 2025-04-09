import React, { useContext, useState } from 'react';
import {
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    ListItemSecondaryAction,
    Button,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts/PieChart';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext';

const TeamDashboard = () => {
    const { teamData, loading, setLoading, setTeamData } = useContext(TeamContext);
    const { prioritizationSchemes, selectedTeam } = useContext(GlobalContext);
    
    const [goalIndex, setGoalIndex] = useState(0);

    const sortedSprints = (teamData?.sprints || []).sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );
    
    // State: which sprint index we're on (0 = newest)
    const [currentSprintIndex, setCurrentSprintIndex] = useState(0);
    
    const hasSprints = sortedSprints.length > 0;
    const currentSprint = hasSprints ? sortedSprints[currentSprintIndex] : null;
    
    // Find the matching Sprint Backlog for this sprint
    const sprintBacklog = teamData?.sprintBacklogs?.find(
        (sb) => sb.sprintID === currentSprint?.sprintID
    );
    
    // Handlers to navigate Sprints
    const handlePrevSprint = () => {
        if (currentSprintIndex < sortedSprints.length - 1) {
            setCurrentSprintIndex((prev) => prev + 1);
        }
    };
    const handleNextSprint = () => {
        if (currentSprintIndex > 0) {
            setCurrentSprintIndex((prev) => prev - 1);
        }
    };

    const hasGoals = teamData.productGoals.length > 0;
    const currentGoal = hasGoals ? teamData.productGoals[goalIndex] : null;
  
    // Handlers to navigate goals
    const handlePrevGoal = () => {
        if (goalIndex > 0) {
            setGoalIndex((prev) => prev - 1);
        }
    };
  
    const handleNextGoal = () => {
        if (goalIndex < teamData.productGoals.length - 1) {
            setGoalIndex((prev) => prev + 1);
        }
    };

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
                        {/* Title + Arrows */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" gutterBottom>
                                Product Goal
                            </Typography>

                            {/* If more than one goal, show arrows */}
                            {teamData.productGoals.length > 1 && (
                                <Box>
                                    <Tooltip title="Previous Goal">
                                        <IconButton
                                            onClick={handlePrevGoal}
                                            disabled={goalIndex === 0}
                                            size="small"
                                        >
                                            <ChevronLeftIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Next Goal">
                                        <IconButton
                                            onClick={handleNextGoal}
                                            disabled={goalIndex === teamData.productGoals.length - 1}
                                            size="small"
                                        >
                                            <ChevronRightIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>

                        {hasGoals ? (
                            <>
                                {/* Product Goal Description */}
                                <Typography variant="body1">
                                    {currentGoal.description}
                                </Typography>

                                <Divider style={{ margin: '10px 0' }} />

                                {/* Date */}
                                <Typography variant="body2">
                                    Created on: {new Date(currentGoal.createdDate).toLocaleDateString()}
                                </Typography>

                                {/* Owner */}
                                <Typography variant="body2">
                                    Owner: {currentGoal.responsiblePerson
                                        ? `${currentGoal.responsiblePerson.firstName} ${currentGoal.responsiblePerson.lastName}`
                                        : 'The Whole Team'}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2">No product goal found.</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Tests Passed - Gauge */}
            <Grid item xs={12} sm={6} md={4}>
                <Card style={{ height: '100%' }}>
                    <CardContent>
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
                                onClick={handleRetakeTest}
                            >
                                {teamData.evaluation?.evaluatedOn ? "Retake evaluation" : "Evaluate SCRUM"}
                            </Button>
                        </Stack>

                        {/* Gauge component */}
                        {teamData.evaluation?.evaluatedOn && (
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
                        )}
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
                        <Typography variant="body2" color="textSecondary">
                            {teamData.evaluation?.evaluatedOn
                                ? "Evaluation from: " + new Date(teamData.evaluation.evaluatedOn).toLocaleString()
                                : "Not yet evaluated"}
                        </Typography>
                        <Box display="flex" justifyContent="flex-start" sx={{ mt: 1 }}>
                            {teamData.evaluation?.evaluatedOn && (
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
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Product Backlog */}
            <Grid item xs={12} sm={6} md={4} style={{ height: '590px' }}>
                <Card style={{ height: '100%', flexGrow: 1, overflow: 'auto' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Product Backlog
                        </Typography>

                        {/* Owner */}
                        <Typography variant="body2" color="textSecondary">
                            Owner:{' '}
                            {teamData.productBacklog.responsiblePerson
                                ? `${teamData.productBacklog.responsiblePerson.firstName} ${teamData.productBacklog.responsiblePerson.lastName}`
                                : 'The Whole Team'}
                        </Typography>

                        {/* Linked to Product Goal */}
                        <Typography variant="body2" color="textSecondary">
                            {teamData.productBacklog.productGoalID
                                ? 'Linked to Product Goal'
                                : 'Not linked to Product Goal'}
                        </Typography>

                        {(() => {
                            const primaryScheme = prioritizationSchemes.find(
                                (scheme) =>
                                    scheme.prioritizationSchemeID ===
                                    teamData.productBacklog.primaryPrioritizationSchemeID
                            );
                            const secondaryScheme = prioritizationSchemes.find(
                                (scheme) =>
                                    scheme.prioritizationSchemeID ===
                                    teamData.productBacklog.secondaryPrioritizationSchemeID
                            );

                            return (
                                <>
                                    <Typography variant="body2" color="textSecondary">
                                        Primary Priority Scheme:{' '}
                                        {primaryScheme ? primaryScheme.schemeName : 'None'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Secondary Priority Scheme:{' '}
                                        {secondaryScheme ? secondaryScheme.schemeName : 'None'}
                                    </Typography>

                                    {Array.isArray(teamData?.productBacklog?.backlogItems) &&
                                    teamData.productBacklog.backlogItems.length > 0 ? (
                                        <List>
                                            {teamData.productBacklog.backlogItems
                                                .sort((a, b) => {
                                                    // 1) Move "Done" items to the bottom
                                                    if (a.done && !b.done) return 1;
                                                    if (!a.done && b.done) return -1;

                                                    // 2) Sort by primaryPriorityValue (consider scheme)
                                                    if (a.primaryPriorityValue === null) return 1;
                                                    if (b.primaryPriorityValue === null) return -1;

                                                    let primaryComparison = 0;
                                                    if (primaryScheme) {
                                                        if (primaryScheme.schemeName === 'Numerical Ranking DESC') {
                                                            primaryComparison = b.primaryPriorityValue - a.primaryPriorityValue;
                                                        } else {
                                                            // default: ASC
                                                            primaryComparison = a.primaryPriorityValue - b.primaryPriorityValue;
                                                        }
                                                    } else {
                                                        // No primary scheme => treat as ascending
                                                        primaryComparison = a.primaryPriorityValue - b.primaryPriorityValue;
                                                    }

                                                    if (primaryComparison !== 0) return primaryComparison;

                                                    // 3) Sort by secondaryPriorityValue (consider scheme)
                                                    if (a.secondaryPriorityValue === null) return 1;
                                                    if (b.secondaryPriorityValue === null) return -1;

                                                    let secondaryComparison = 0;
                                                    if (secondaryScheme) {
                                                        if (secondaryScheme.schemeName === 'Numerical Ranking DESC') {
                                                            secondaryComparison = b.secondaryPriorityValue - a.secondaryPriorityValue;
                                                        } else {
                                                            // default: ASC
                                                            secondaryComparison = a.secondaryPriorityValue - b.secondaryPriorityValue;
                                                        }
                                                    } else {
                                                        // No secondary scheme => treat as ascending
                                                        secondaryComparison = a.secondaryPriorityValue - b.secondaryPriorityValue;
                                                    }

                                                    return secondaryComparison;
                                                })
                                                .map((item) => {
                                                    let primaryPriorityDisplay = 'None';
                                                    if (primaryScheme) {
                                                        if (
                                                            primaryScheme.schemeName === 'Numerical Ranking ASC' ||
                                                            primaryScheme.schemeName === 'Numerical Ranking DESC' ||
                                                            primaryScheme.schemeName === 'Numerical Ranking'
                                                        ) {
                                                            primaryPriorityDisplay =
                                                                item.primaryPriorityValue !== null
                                                                    ? item.primaryPriorityValue
                                                                    : 'None';
                                                        } else {
                                                            const level = primaryScheme.prioritizationLevels.find(
                                                                (lvl) => lvl.levelValue === item.primaryPriorityValue
                                                            );
                                                            primaryPriorityDisplay = level ? level.levelName : 'None';
                                                        }
                                                    }

                                                    let secondaryPriorityDisplay = 'None';
                                                    if (secondaryScheme) {
                                                        if (
                                                            secondaryScheme.schemeName === 'Numerical Ranking ASC' ||
                                                            secondaryScheme.schemeName === 'Numerical Ranking DESC' ||
                                                            secondaryScheme.schemeName === 'Numerical Ranking'
                                                        ) {
                                                            secondaryPriorityDisplay =
                                                                item.secondaryPriorityValue !== null
                                                                    ? item.secondaryPriorityValue
                                                                    : 'None';
                                                        } else {
                                                            const level = secondaryScheme.prioritizationLevels.find(
                                                                (lvl) => lvl.levelValue === item.secondaryPriorityValue
                                                            );
                                                            secondaryPriorityDisplay = level ? level.levelName : 'None';
                                                        }
                                                    }

                                                    return (
                                                        <ListItem key={item.backlogItemID}>
                                                            <ListItemText
                                                                primary={item.itemName}
                                                                secondary={
                                                                    <>
                                                                        <Typography component="span" variant="body2" color="textPrimary">
                                                                            {item.itemDescription}
                                                                        </Typography>
                                                                        {primaryScheme && (
                                                                            <>
                                                                                <br />
                                                                                <Typography component="span" variant="body2">
                                                                                    Primary Priority: {primaryPriorityDisplay}
                                                                                </Typography>
                                                                            </>
                                                                        )}
                                                                        {secondaryScheme && (
                                                                            <>
                                                                                <br />
                                                                                <Typography component="span" variant="body2">
                                                                                    Secondary Priority: {secondaryPriorityDisplay}
                                                                                </Typography>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                }
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <Typography variant="body2" color={!item.done ? 'green' : 'textSecondary'}>
                                                                    {!item.done ? 'Active' : 'Done'}
                                                                </Typography>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    );
                                                })}
                                        </List>
                                    ) : (
                                        <Typography variant="body2">No backlog items found.</Typography>
                                    )}
                                </>
                            );
                        })()}
                    </CardContent>
                </Card>
            </Grid>

            {/* Sprints */}
            <Grid item xs={12} sm={6} md={4} style={{ height: '590px' }}>
                <Card style={{ height: '100%', flexGrow: 1, overflow: 'auto' }}>
                    <CardContent>
                        {/* Title with navigation arrows if more than one sprint */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" gutterBottom>
                                Sprints
                            </Typography>
                            {sortedSprints.length > 1 && (
                                <Box>
                                    <Tooltip title="Older Sprint">
                                        <IconButton
                                            onClick={handlePrevSprint}
                                            disabled={currentSprintIndex === sortedSprints.length - 1}
                                            size="small"
                                        >
                                            <ChevronLeftIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Newer Sprint">
                                        <IconButton
                                            onClick={handleNextSprint}
                                            disabled={currentSprintIndex === 0}
                                            size="small"
                                        >
                                            <ChevronRightIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>

                        {hasSprints ? (
                            <>
                                {/* Label the sprint as "Sprint N" where N = "Sprints Count - index" */}
                                <Typography variant="h6">
                                    {`Sprint #${sortedSprints.length - currentSprintIndex}`}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Start Date: {new Date(currentSprint.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    End Date: {currentSprint.endDate
                                        ? new Date(currentSprint.endDate).toLocaleDateString()
                                        : 'Ongoing'}
                                </Typography>
                                {/* Linked to Product Goal info for Sprint Backlog */}
                                <Typography variant="body2" color="textSecondary">
                                    {currentSprint.productGoalID
                                        ? 'Linked to Product Goal'
                                        : 'Not linked to Product Goal'}
                                </Typography>
                                <Divider style={{ margin: '10px 0' }} />
                                <Typography variant="body1" gutterBottom>
                                    Goal: {currentSprint.sprintGoal?.description || 'No goal assigned'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Owner: {currentSprint.sprintGoal?.responsiblePerson
                                        ? `${currentSprint.sprintGoal?.responsiblePerson.firstName} ${currentSprint.sprintGoal?.responsiblePerson.lastName}`
                                        : 'The Whole Team'}
                                </Typography>
                                <Divider style={{ margin: '10px 0' }} />

                                {/* Increments within the sprint */}
                                <Typography variant="body2" gutterBottom>
                                    Increments:
                                </Typography>
                                {currentSprint.increments && currentSprint.increments.length > 0 ? (
                                    <List>
                                        {currentSprint.increments.map((increment) => (
                                            <ListItem key={increment.incrementID}>
                                                <ListItemText
                                                    primary={increment.description}
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {increment.receivedBy
                                                                    ? `Received by: ${increment.receivedBy.firstName} ${increment.receivedBy.lastName}`
                                                                    : 'Received by: Unassigned'}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <Typography variant="body2" color={!increment.done ? 'green' : 'textSecondary'}>
                                                        {!increment.done ? 'Active' : 'Done'}
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2">No increments found.</Typography>
                                )}

                                <Divider style={{ margin: '10px 0' }} />

                                {/* Sprint Backlog Items */}
                                <Typography variant="body2" gutterBottom>
                                    Sprint Backlog:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Owner: {sprintBacklog?.responsiblePerson
                                        ? `${sprintBacklog?.responsiblePerson.firstName} ${sprintBacklog?.responsiblePerson.lastName}`
                                        : 'The Whole Team'}
                                </Typography>
                                {sprintBacklog?.backlogItems?.length ? (
                                    <List>
                                        {sprintBacklog.backlogItems.map((item) => (
                                            <ListItem key={item.backlogItemID}>
                                                <ListItemText
                                                    primary={item.itemName}
                                                    secondary={item.itemDescription}
                                                />
                                                <ListItemSecondaryAction>
                                                    <Typography variant="body2" color={!item.done ? 'green' : 'textSecondary'}>
                                                        {!item.done ? 'Active' : 'Done'}
                                                    </Typography>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2">No backlog items found.</Typography>
                                )}
                            </>
                        ) : (
                            <Typography variant="body2">No sprints found.</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Increments Card */}
            <Grid item xs={12} sm={6} md={4} style={{ height: '590px' }}>
            <Card style={{ height: '100%', flexGrow: 1, overflow: 'auto' }}>
                <CardContent>
                <Typography variant="h5" gutterBottom>
                    Increments
                </Typography>
                {teamData.increments && teamData.increments.length > 0 ? (
                    <List>
                    {teamData.increments.map((increment) => {
                        // Format deadline: if not provided, show "None"
                        const deadlineText = increment.deadline
                        ? new Date(increment.deadline).toLocaleDateString()
                        : 'None';

                        // Calculate sprint info: if increment.sprint exists,
                        // compute the sprint number as in your Sprint card and include start/end dates.
                        let sprintInfo = null;
                        if (increment.sprint) {
                        const sprintIndex = sortedSprints.findIndex(
                            s => s.sprintID === increment.sprint.sprintID
                        );
                        let sprintNumberText = 'None';
                        if (sprintIndex !== -1) {
                            sprintNumberText = `Sprint #${sortedSprints.length - sprintIndex}`;
                        }
                        sprintInfo = (
                            <Box mt={1}>
                            <Typography variant="body2" color="textSecondary">
                                Linked Sprint: {sprintNumberText}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Start Date: {new Date(increment.sprint.startDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                End Date: {increment.sprint.endDate
                                ? new Date(increment.sprint.endDate).toLocaleDateString()
                                : 'Ongoing'}
                            </Typography>
                            </Box>
                        );
                        } else {
                        sprintInfo = (
                            <Typography variant="body2" color="textSecondary">
                            Linked Sprint: None
                            </Typography>
                        );
                        }

                        // Received by info
                        const receivedBy = increment.receivedBy
                        ? `${increment.receivedBy.firstName} ${increment.receivedBy.lastName}`
                        : 'Unassigned';

                        // Product Goal linkage info
                        const productGoalInfo = increment.productGoalID
                        ? 'Linked to Product Goal'
                        : 'Not linked to Product Goal';

                        return (
                        <ListItem key={increment.incrementID} alignItems="flex-start">
                            <ListItemText
                            primary={increment.description}
                            secondary={
                                <>
                                <Typography variant="body2" color="textSecondary">
                                    Received by: {receivedBy}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Deadline: {deadlineText}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {productGoalInfo}
                                </Typography>
                                {sprintInfo}
                                </>
                            }
                            />
                            <ListItemSecondaryAction>
                            <Typography variant="body2" color={!increment.done ? 'green' : 'textSecondary'}>
                                {!increment.done ? 'Active' : 'Done'}
                            </Typography>
                            </ListItemSecondaryAction>
                        </ListItem>
                        );
                    })}
                    </List>
                ) : (
                    <Typography variant="body2">No increments found.</Typography>
                )}
                </CardContent>
            </Card>
            </Grid>

        </Grid>
    );
};

export default TeamDashboard;
