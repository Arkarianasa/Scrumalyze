import React, { useContext, useState } from 'react';
import { Typography, Box, Grid } from '@mui/material';

import { GlobalContext } from '../context/GlobalContext';

import TeamTab from './TeamTab';
import TeamDashboard from './TeamDashboard';
import ProblemsOverview from './ProblemsOverview';
import WorkItemsOverview from './WorkItemsOverview';
import SprintsDashboard from './SprintsDashboard';

const TeamDashboardPage = () => {
    const { selectedTeam } = useContext(GlobalContext);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const renderContent = () => {
        switch (selectedTab) {
            case 0:
                return <TeamDashboard />;
            case 1:
                return <ProblemsOverview />;
            case 2:
                return <WorkItemsOverview />;
            case 3:
                return <SprintsDashboard />;
            default:
                return <TeamDashboard />;
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box sx={{ width: '250px', position: 'fixed', top: '60px', left: 0 }}>
                <TeamTab selectedTab={selectedTab} handleTabChange={handleTabChange} />
            </Box>
            <Box 
                sx={{ 
                    marginLeft: '240px',
                    width: '100%', 
                    overflowY: 'auto', 
                    padding: 2 
                }}
            >
                <Typography variant="h4" sx={{ padding: '10px', paddingBottom:'5px' }}>
                    Team {selectedTeam.teamName} Dashboard
                </Typography>
                
                <Box
                    sx={{
                        padding: '16px',
                        paddingTop: '0px'
                    }}
                >
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default TeamDashboardPage;
