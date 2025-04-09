import React, { useContext } from 'react';
import { Tabs, Tab } from '@mui/material';
import { TeamContext } from '../context/TeamContext';

const TeamTab = ({ selectedTab, handleTabChange }) => {
  const { teamData } = useContext(TeamContext);

  // Simple approach:
  const isEvaluationAvailable = !!teamData.evaluation; 

  return (
    <Tabs
      orientation="vertical"
      value={selectedTab}
      onChange={handleTabChange}
      sx={{
        height: '100vh',
        backgroundColor: 'primary.main',
        color: 'white',
        '& .MuiTab-root': { color: 'white' },
        '& .MuiTab-disabled': { color: 'white' },
        '& .Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }
      }}
    >
      <Tab label="Team Dashboard" />
      <Tab label="Team Metadata" />
      <Tab label="SCRUM Overview" disabled={!isEvaluationAvailable} />
      <Tab label="Pathological Behaviors" disabled={!isEvaluationAvailable}  />
      <Tab label="Work Items" />
      <Tab label="Evaulation History" />
    </Tabs>
  );
};

export default TeamTab;