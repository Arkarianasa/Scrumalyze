import React, { useContext, useState } from 'react';
import { Typography, Box, Grid } from '@mui/material';

import { GlobalContext } from '../context/GlobalContext';

import TeamTab from './TeamTab';
import TeamDashboard from './TeamDashboard';
import ProblemsOverview from './ProblemsOverview';
import WorkItems from './WorkItems';
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
                return <WorkItems />;
            case 3:
                return <SprintsDashboard />;
            default:
                return <TeamDashboard />;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: '250px',
                    position: 'fixed',
                    top: '60px',
                    left: 0,
                    backgroundColor: '#1976d2',
                    borderRight: 'none', // Remove any borders that may cause shadow effects
                    boxShadow: 'none',  // Ensure no shadow is applied here
                    padding: 0,
                    margin: 0
                }}
            >
                <TeamTab selectedTab={selectedTab} handleTabChange={handleTabChange} />
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    marginLeft: '250px',
                    padding: 2,
                    width: '100%',
                    overflowY: 'auto',
                    backgroundColor: '#fff',
                    padding: 0,
                    margin: 0
                }}
            >
                {/* Fixed Header */}
                <Typography
                    variant="h4"
                    sx={{
                        padding: '10px',
                        position: 'fixed',
                        top: '60px',
                        left: '250px', // Align with sidebar width
                        width: 'calc(100% - 250px)',
                        backgroundColor: '#fff',
                        zIndex: 1000,
                    }}
                >
                    Team {selectedTeam.teamName}
                </Typography>

                {/* Content Area with Padding Offset for Header */}
                <Box sx={{ paddingTop: '120px', marginLeft: '260px', marginRight: '16px', paddingBottom: '16px' }}>
                    {renderContent()}
                </Box>
            </Box>
        </Box>

    );
};

export default TeamDashboardPage;
