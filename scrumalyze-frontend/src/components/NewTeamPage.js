import React from 'react';
import { Box } from '@mui/material';
import AddTeamStepper from '../components/TeamStepper';

const NewTeamPage = () => {
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
            <AddTeamStepper />
        </Box>
    );
};

export default NewTeamPage;