import React from 'react';
import { Tabs, Tab } from '@mui/material';

const TeamTab = ({ selectedTab, handleTabChange }) => {
    return (
        <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
                height: '100vh',
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiTab-root': { color: 'white' },
                '& .Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }
            }}
        >
            <Tab label="Team Dashboard" />
            <Tab label="Problems Overview" />
            <Tab label="Work Items Overview" />
            <Tab label="Sprints Dashboard" />
        </Tabs>
    );
};

export default TeamTab;
