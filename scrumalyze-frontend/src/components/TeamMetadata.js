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
  ToolTip
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext'; // If you have a global context

const TeamMetadata = () => {
    const { teamData, loading } = useContext(TeamContext);
  const { selectedTeam, processStepTypes, scrumRoles } = useContext(GlobalContext);

    console.log(selectedTeam);
    console.log(teamData);
  const combinedRoles = [...scrumRoles, ...selectedTeam.scrumRoles];

  // Process Steps from teamData
  const processSteps = teamData?.processSteps || [];

  // Timeboxes from teamData
  const timeboxes = teamData?.timeboxes || [];

  // Definitions of Done
  const dodList = teamData?.dodList || [];

  function formatDuration(durationHours = 0) {
    const totalMinutes = Math.round(durationHours * 60);
    const days = Math.floor(totalMinutes / (selectedTeam.workDayHours * 60));
    const remainingAfterDays = totalMinutes % (selectedTeam.workDayHours * 60);
    const hours = Math.floor(remainingAfterDays / 60);
    const minutes = remainingAfterDays % 60;

    // Build a string, skipping zero values if you want
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
    <Box display="flex" flexDirection="column" gap={2}>
      {/* 1) Team Name + info about hours */}
      <Card>
        <CardContent>
          <Typography variant="h6">Team Info</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>Team Name: {selectedTeam.teamName}</Typography>
          <Typography>Work hours per day: {selectedTeam.workDayHours}</Typography>
        </CardContent>
      </Card>

      {/* 2) Roles */}
      <Card>
        <CardContent>
          <Typography variant="h6">Roles</Typography>
          <Divider sx={{ my: 1 }} />
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
        </CardContent>
      </Card>

      {/* 3) Process Steps */}
      <Card>
        <CardContent>
            <Typography variant="h6">Process Steps</Typography>
            <Divider sx={{ my: 1 }} />
            {processSteps.length ? (
            <List>
                {processSteps.map((step) => (
                <ListItem key={step.processStepID}>
                    <ListItemText
                    primary={
                        processStepTypes[step.processStepTypeID]?.processStepName ||
                        `Type #${step.processStepTypeID}`
                    }
                    secondary={
                        <>
                        <div>
                            Guided By: {step.guidedByPerson
                            ? `${step.guidedByPerson.firstName} ${step.guidedByPerson.lastName}`
                            : 'The Whole Team'}
                        </div>
                        <div>Timebox ID: {step.timeboxID ?? 'N/A'}</div>
                        <div>
                            Reviews Increment: {step.reviewsIncrement ? 'Yes' : 'No'}
                        </div>
                        <div>
                            Updates Backlog: {step.updatesProductBacklog ? 'Yes' : 'No'}
                        </div>
                        <div>
                            Adjusts Goal: {step.adjustsProductGoal ? 'Yes' : 'No'}
                        </div>
                        <div>
                            Creates Sprint Goal: {step.createsSprintGoal ? 'Yes' : 'No'}
                        </div>
                        <div>
                            Improves Sprint: {step.improvesSprint ? 'Yes' : 'No'}
                        </div>
                        </>
                    }
                    />
                </ListItem>
                ))}
            </List>
            ) : (
            <Typography>No process steps found.</Typography>
            )}
        </CardContent>
        </Card>

      {/* 4) Timeboxes */}
      <Card>
        <CardContent>
          <Typography variant="h6">Timeboxes</Typography>
          <Divider sx={{ my: 1 }} />
          {timeboxes.length ? (
            <List>
              {timeboxes.map((tb) => {
                // Convert tb.duration into "x days, y hours, z minutes"
                const durationString = formatDuration(
                  tb.duration
                );

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
        </CardContent>
      </Card>

      {/* 5) Definitions of Done */}
      <Card>
        <CardContent>
          <Typography variant="h6">Definitions of Done</Typography>
          <Divider sx={{ my: 1 }} />
          {dodList.length ? (
            <List>
              {dodList.map((dod) => (
                <ListItem key={dod.definitionOfDoneID}>
                  {dod.isCompanyPolicy && (
                    <ListItemIcon>
                      <VerifiedUserIcon />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={dod.constraintDescription} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No definitions of done found.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamMetadata;
