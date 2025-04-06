import React, { useContext, useState } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Tooltip
} from '@mui/material';

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts/PieChart';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LaunchIcon from '@mui/icons-material/Launch';
import GroupIcon from '@mui/icons-material/Group';

import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext';

const TeamDashboard = () => {
    const { teamData, loading, setLoading, setTeamData } = useContext(TeamContext);
    const { prioritizationSchemes, selectedTeam } = useContext(GlobalContext);
    
    const [goalIndex, setGoalIndex] = useState(0);
    const [openCommunicationMatrix, setOpenCommunicationMatrix] = useState(false);

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
    
      // Handlers to navagite Sprints
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

    const handleOpenCommunicationMatrix = () => {
        setOpenCommunicationMatrix(true);
    };
  
    const handleCloseCommunicationMatrix = () => {
        setOpenCommunicationMatrix(false);
    };

  // Prepare the communication matrix data
  const renderCommunicationMatrix = () => {
    // 1. All persons
    const persons = teamData?.persons || [];
    // Sort them (e.g., by ID) for consistent row/column ordering
    const sortedPersons = [...persons].sort((a, b) => a.personID - b.personID);

    // 2. Build a Set of pairs. For each communication i->j, 
    //    add both (i,j) and (j,i), so the matrix is symmetric
    const commSet = new Set();
    if (teamData?.communication?.length) {
      teamData.communication.forEach((comm) => {
        commSet.add(`${comm.sourcePersonID}-${comm.targetPersonID}`);
        commSet.add(`${comm.targetPersonID}-${comm.sourcePersonID}`);
      });
    }
    // 3. Construct the actual NxN table
    return (
        <Table sx={{
            borderCollapse: 'collapse', // Ensures borders are rendered as a single line
            width: '100%',
            '& .MuiTableCell-root': {
              border: '1px solid rgba(224, 224, 224, 1)', // Light gray border for each cell
            },
          }}>
          <TableHead>
            <TableRow>
              <TableCell />
              {sortedPersons.map((p) => (
                <TableCell key={p.personID} align="center">
                  {p.firstName} {p.lastName} ({p.role.roleName})
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPersons.map((rowPerson) => (
              <TableRow key={rowPerson.personID}>
                {/* Row label (person name) */}
                <TableCell>
                  {rowPerson.firstName} {rowPerson.lastName} ({rowPerson.role.roleName})
                </TableCell>
                {/* Columns */}
                {sortedPersons.map((colPerson) => {
                  const isSame = rowPerson.personID === colPerson.personID;
                  const hasComm = commSet.has(
                    `${rowPerson.personID}-${colPerson.personID}`
                  );
                  return (
                    <TableCell key={`${rowPerson.personID}-${colPerson.personID}`} align="center">
                      {isSame ? '-' : hasComm ? 'X' : ''}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    console.log(teamData);

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
                                Created on:{' '}
                                {new Date(currentGoal.createdDate).toLocaleDateString()}
                            </Typography>

                            {/* Owner */}
                            <Typography variant="body2">
                                Owner:{' '}
                                {currentGoal.responsiblePerson
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

                    {/* Linked to Product Goal / Not Linked */}
                    <Typography variant="body2" color="textSecondary">
                        {teamData.productBacklog.productGoalID
                        ? 'Linked to Product Goal'
                        : 'Not linked to Product Goal'}
                    </Typography>

                    {/*
                        Grab the primary & secondary scheme objects from
                        prioritizationSchemes so we can display the scheme names
                    */}
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
                            {/* Display which scheme is set for primary & secondary */}
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
                                    // Determine displays
                                    let primaryPriorityDisplay = 'None';
                                    if (primaryScheme) {
                                    if (
                                        primaryScheme.schemeName === 'Numerical Ranking ASC' ||
                                        primaryScheme.schemeName === 'Numerical Ranking DESC' ||
                                        primaryScheme.schemeName === 'Numerical Ranking'
                                    ) {
                                        // Just show the numeric value or "None"
                                        primaryPriorityDisplay =
                                        item.primaryPriorityValue !== null
                                            ? item.primaryPriorityValue
                                            : 'None';
                                    } else {
                                        // e.g. MoSCoW or any other scheme with named levels
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
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary"
                                            >
                                                {item.itemDescription}
                                            </Typography>
                                            {/* Only show Primary Priority if there's a primaryScheme */}
                                            {primaryScheme && (
                                                <>
                                                <br />
                                                <Typography component="span" variant="body2">
                                                    Primary Priority: {primaryPriorityDisplay}
                                                </Typography>
                                                </>
                                            )}
                                            {/* Only show Secondary Priority if there's a secondaryScheme */}
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
                                        <Typography
                                            variant="body2"
                                            color={!item.done ? 'green' : 'textSecondary'}
                                        >
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
                                {`Sprint ${sortedSprints.length - currentSprintIndex}`}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                Start Date:{' '}
                                {new Date(currentSprint.startDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                End Date:{' '}
                                {currentSprint.endDate
                                ? new Date(currentSprint.endDate).toLocaleDateString()
                                : 'Ongoing'}
                            </Typography>

                            <Divider style={{ margin: '10px 0' }} />

                            <Typography variant="body1" gutterBottom>
                                {/* Sprint Goal description or fallback */}
                                Goal:{' '}
                                {currentSprint.sprintGoal?.description || 'No goal assigned'}
                            </Typography>

                            {/* Goal Owner */}
                            <Typography variant="body2" color="textSecondary">
                                Owner:{' '}
                                {currentSprint.sprintGoal?.responsiblePerson
                                ? `${currentSprint.sprintGoal?.responsiblePerson.firstName} ${currentSprint.sprintGoal?.responsiblePerson.lastName}`
                                : 'The Whole Team'}
                            </Typography>

                            <Divider style={{ margin: '10px 0' }} />

                            {/* Increments */}
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
                                                increment.receivedBy
                                                ? `Received by: ${increment.receivedBy.firstName} ${increment.receivedBy.lastName}`
                                                : 'Received by: Unassigned'
                                            }
                                            />
                                            <ListItemSecondaryAction>
                                            <Typography
                                                variant="body2"
                                                color={!increment.done ? 'green' : 'textSecondary'}
                                            >
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

                            {/* Backlog Owner */}
                            <Typography variant="body2" color="textSecondary">
                                Owner:{' '}
                                {sprintBacklog?.responsiblePerson
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
                                        <Typography
                                        variant="body2"
                                        color={!item.done ? 'green' : 'textSecondary'}
                                        >
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


                {/* Team Members */}
                <Grid item xs={12} sm={6} md={4} style={{ height: '590px' }}>
                    <Card style={{ height: '100%', flexGrow: 1, overflow: 'auto' }}>
                        <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" gutterBottom>
                            Team Members
                            </Typography>
                            {/* Icon button with tooltip to open Communication Matrix */}
                            <Tooltip title="Open Communication Matrix">
                            <IconButton onClick={handleOpenCommunicationMatrix}>
                                <LaunchIcon />
                            </IconButton>
                            </Tooltip>
                        </Box>

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
                                    secondary={
                                    person.role
                                        ? person.role.roleName
                                        : 'No role assigned'
                                    }
                                />
                                {/* Show GroupIcon or GroupOffIcon based on isScrumTeamMember */}
                                <Tooltip
                                    title={
                                    person.isScrumTeamMember
                                        ? 'Scrum Team Member'
                                        : ''
                                    }
                                >
                                    <Box display="flex" alignItems="center" marginLeft={1}>
                                    {person.isScrumTeamMember ? (
                                        <GroupIcon />
                                    ) : ''}
                                    </Box>
                                </Tooltip>
                                </ListItem>
                            ))}
                            </List>
                        ) : (
                            <Typography variant="body2">No team members found.</Typography>
                        )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Dialog for displaying Communication Matrix */}
                <Dialog
                    open={openCommunicationMatrix}
                    onClose={handleCloseCommunicationMatrix}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>Communication Matrix</DialogTitle>
                    <DialogContent dividers>
                    {teamData?.communication && teamData.communication.length > 0 ? (
                        renderCommunicationMatrix()
                    ) : (
                        <Typography variant="body2">
                        No communication data available.
                        </Typography>
                    )}
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleCloseCommunicationMatrix}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
    );
};

export default TeamDashboard;