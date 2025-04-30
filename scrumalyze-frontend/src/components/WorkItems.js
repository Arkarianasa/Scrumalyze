import React, { useContext, useState } from 'react';
import {
  CircularProgress,
  Box,
  Card,
  CardContent,
  Tooltip,
  ListItemIcon,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { TeamContext } from '../context/TeamContext';
import { GlobalContext } from '../context/GlobalContext';
import AssignedPersons from './AssignedPersons';

const WorkItemCard = ({ workItem, workItemTypes, teamData, selectedTeam }) => {
  const [acOpen, setAcOpen] = useState(false);
  const [dodOpen, setDodOpen] = useState(false);
  const [assignedOpen, setAssignedOpen] = useState(false);

  const workItemType = workItemTypes.find(
    (type) => type.workItemTypeID === workItem.workItemTypeID
  );
  const timebox = teamData.timeboxes.find(
    (tb) => tb.timeboxID === workItem.timeboxID
  );

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

  return (
    <Card
      variant="outlined"
      sx={{
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexGrow: 1,
        overflow: 'auto',
      }}
    >
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          {workItem.description}
        </Typography>

        <Chip
          sx={{ marginBottom: '10px' }}
          label={workItem.done ? 'Done' : 'In Progress'}
          color={workItem.done ? 'success' : 'warning'}
        />

        <Typography variant="body2" color="textSecondary">
          Type: {workItemType ? workItemType.typeName : 'N/A'}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          {workItem.deadline
            ? `Deadline: ${new Date(workItem.deadline).toLocaleDateString()}`
            : 'Deadline: None'}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Timebox: {timebox
            ? `${timebox.timeboxDescription} (${formatDuration(timebox.duration)})`
            : 'None'}
        </Typography>

        {/* Acceptance Criteria Section */}
        {Array.isArray(workItem.acceptanceCriterias) && workItem.acceptanceCriterias.length > 0 && (
          <Box mt={2}>
            <Box
              display="flex"
              alignItems="center"
              onClick={() => setAcOpen((prev) => !prev)}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle2" color="textPrimary">
                Acceptance Criteria
              </Typography>
              <IconButton size="small">
                {acOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            {acOpen && (
              <List dense>
                {workItem.acceptanceCriterias.map((ac) => (
                  <ListItem
                    key={ac.acceptanceCriteriaID}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText primary={ac.acceptanceCriteria.constraintDescription} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Definition of Done Section */}
        {Array.isArray(workItem.definitionsOfDone) && workItem.definitionsOfDone.length > 0 && (
          <Box mt={2}>
            <Box
              display="flex"
              alignItems="center"
              onClick={() => setDodOpen((prev) => !prev)}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle2" color="textPrimary">
                Definition of Done
              </Typography>
              <IconButton size="small">
                {dodOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            {dodOpen && (
              <List dense>
                {workItem.definitionsOfDone.map((dod) => (
                  <ListItem
                    key={dod.definitionOfDoneID}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText primary={dod.definitionOfDone.constraintDescription} />
                    {dod.definitionOfDone.isCompanyPolicy && (
                      <ListItemIcon>
                        <Tooltip title="Company Policy">
                          <VerifiedUserIcon />
                        </Tooltip>
                      </ListItemIcon>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Assigned Persons Section */}
        <Box mt={2}>
          <Box
            display="flex"
            alignItems="center"
            onClick={() => setAssignedOpen((prev) => !prev)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="subtitle2" color="textPrimary">
              Assigned Persons
            </Typography>
            <IconButton size="small">
              {assignedOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          {assignedOpen && (
            <AssignedPersons
              workItemPersons={workItem.persons}
              persons={teamData.persons}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const WorkItems = () => {
  const { teamData, loading } = useContext(TeamContext);
  const { workItemTypes, selectedTeam } = useContext(GlobalContext);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ padding: 2 }}>
      {teamData.workItems.map((workItem) => (
        <Grid item xs={12} sm={6} md={4} key={workItem.workItemID}>
          <WorkItemCard
            workItem={workItem}
            workItemTypes={workItemTypes}
            teamData={teamData}
            selectedTeam={selectedTeam}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default WorkItems;