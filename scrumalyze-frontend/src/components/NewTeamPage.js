import React from 'react';
import { Typography } from '@mui/material';
import AddTeamStepper from '../components/TeamStepper';

const NewTeamPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h4">New Team Page</Typography>
            <AddTeamStepper />
        </div>
    );
};

export default NewTeamPage;