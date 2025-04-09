import React, { useContext, useState } from 'react';
import {
  CircularProgress,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LaunchIcon from '@mui/icons-material/Launch';
import GroupIcon from '@mui/icons-material/Group';
import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext';

const TeamMetadata = () => {
  const { teamData, loading } = useContext(TeamContext);
  const { selectedTeam, processStepTypes, scrumRoles } = useContext(GlobalContext);

  // Combine team roles from global and team-specific sources.
  const combinedRoles = [...scrumRoles, ...selectedTeam.scrumRoles];

  // Process Steps, Timeboxes, and Definitions of Done from teamData.
  const processSteps = teamData?.processSteps || [];
  const timeboxes = teamData?.timeboxes || [];
  const dodList = teamData?.dodList || [];

  // State to keep track of the current process step index and slide direction.
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('left');

  // State for communication Matrix window
  const [openCommunicationMatrix, setOpenCommunicationMatrix] = useState(false);

  // Handlers for navigating the process steps.
  const handlePreviousStep = () => {
    setSlideDirection('right');
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextStep = () => {
    setSlideDirection('left');
    setCurrentStepIndex((prev) => Math.min(prev + 1, processSteps.length - 1));
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

  function formatDuration(durationHours = 0) {
    const totalMinutes = Math.round(durationHours * 60);
    const days = Math.floor(totalMinutes / (selectedTeam.workDayHours * 60));
    const remainingAfterDays = totalMinutes % (selectedTeam.workDayHours * 60);
    const hours = Math.floor(remainingAfterDays / 60);
    const minutes = remainingAfterDays % 60;

    const parts = [];
    if (days) parts.push(`${days} work day${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

    return parts.length ? parts.join(', ') : '0 hours';
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box sx={{ overflow: 'auto', p: 2 }}>
      <Grid container spacing={2}>
        {/* Column 1: Team Info + Roles */}
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Card>
              <CardContent>
                <Typography variant="h6">Team Info</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Team Name: {selectedTeam.teamName}</Typography>
                <Typography>Work hours per day: {selectedTeam.workDayHours}</Typography>
              </CardContent>
            </Card>
            <Card style={{ height: '643px' }}>
              <CardContent>
                <Typography variant="h6">Roles</Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ maxHeight: '563px', overflowY: 'auto' }}>
                  {combinedRoles.length ? (
                    <List>
                      {combinedRoles.map((role) => (
                        <ListItem key={role.roleID}>
                          <ListItemText
                            primary={role.roleName}
                            secondary={role.roleDescription}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No roles found.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Column 2: Timeboxes + Definitions of Done */}
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Card style={{ height: '390px' }}>
              <CardContent>
                <Typography variant="h6">Timeboxes</Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ maxHeight: '310px', overflowY: 'auto' }}>
                  {timeboxes.length ? (
                    <List>
                      {timeboxes.map((tb) => {
                        const durationString = formatDuration(tb.duration);
                        return (
                          <ListItem key={tb.timeboxID}>
                            <ListItemText
                              primary={tb.timeboxDescription}
                              secondary={`Duration: ${durationString}`}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Typography>No timeboxes found.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
            <Card style={{ height: '390px' }}>
              <CardContent>
                <Typography variant="h6">Definitions of Done</Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ maxHeight: '310px', overflowY: 'auto' }}>
                  {dodList.length ? (
                    <List>
                      {dodList.map((dod) => (
                        <ListItem key={dod.definitionOfDoneID}>
                          <ListItemText primary={dod.constraintDescription} />
                          {dod.isCompanyPolicy && (
                            <ListItemIcon>
                              <Tooltip title="Company Policy">
                                <VerifiedUserIcon />
                              </Tooltip>
                            </ListItemIcon>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No definitions of done found.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Column 3: Process Steps + Team Members */}
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Card style={{ height: '340px' }}>
              <CardContent>
                <Typography variant="h6">Process Steps</Typography>
                <Divider sx={{ my: 1 }} />
                {processSteps.length ? (
                  <>
                    <Slide
                      direction={slideDirection}
                      in={true}
                      mountOnEnter
                      unmountOnExit
                      key={currentStepIndex}
                    >
                      <Box>
                        {(() => {
                          const currentStep = processSteps[currentStepIndex];
                          return (
                            <>
                              <Typography variant="h6" sx={{ paddingBottom: '8px' }}>
                                {processStepTypes[currentStep.processStepTypeID - 1]?.processStepName ||
                                  `Type #${currentStep.processStepTypeID}`}
                              </Typography>
                              
                              <Typography>
                                Guided By:{' '}
                                {currentStep.guidedByPerson
                                  ? `${currentStep.guidedByPerson.firstName} ${currentStep.guidedByPerson.lastName} (${currentStep.guidedByPerson.role.roleName})`
                                  : 'The Whole Team'}
                              </Typography>
                              <Typography>
                                Timebox:{' '}
                                {currentStep.timeboxID 
                                  ? `${currentStep.timebox.timeboxDescription} (${formatDuration(currentStep.timebox.duration)})`
                                  : 'N/A'}
                              </Typography>
                              <Typography>
                                Reviews Increment: {currentStep.reviewsIncrement ? 'Yes' : 'No'}
                              </Typography>
                              <Typography>
                                Updates Backlog: {currentStep.updatesProductBacklog ? 'Yes' : 'No'}
                              </Typography>
                              <Typography>
                                Adjusts Goal: {currentStep.adjustsProductGoal ? 'Yes' : 'No'}
                              </Typography>
                              <Typography>
                                Creates Sprint Goal: {currentStep.createsSprintGoal ? 'Yes' : 'No'}
                              </Typography>
                              <Typography>
                                Improves Sprint: {currentStep.improvesSprint ? 'Yes' : 'No'}
                              </Typography>
                            </>
                          );
                        })()}
                      </Box>
                    </Slide>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <IconButton
                        onClick={handlePreviousStep}
                        disabled={currentStepIndex === 0}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <Typography variant="body2">
                        Step {currentStepIndex + 1} of {processSteps.length}
                      </Typography>
                      <IconButton
                        onClick={handleNextStep}
                        disabled={currentStepIndex === processSteps.length - 1}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <Typography>No process steps found.</Typography>
                )}
              </CardContent>
            </Card>

            <Card style={{ height: '440px', flexGrow: 1, overflow: 'auto' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" gutterBottom>
                    Team Members
                  </Typography>
                  <Tooltip title="Open Communication Matrix">
                    <IconButton onClick={handleOpenCommunicationMatrix}>
                      <LaunchIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ maxHeight: '360px', overflowY: 'auto' }}>
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
                          <Tooltip
                            title={
                              person.isScrumTeamMember
                                ? 'Scrum Team Member'
                                : ''
                            }
                          >
                            <Box display="flex" alignItems="center" marginLeft={1}>
                              {person.isScrumTeamMember ? <GroupIcon /> : ''}
                            </Box>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2">No team members found.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
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
    </Box>
  );
};

export default TeamMetadata;
