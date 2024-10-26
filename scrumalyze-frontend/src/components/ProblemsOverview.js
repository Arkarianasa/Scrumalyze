import React, { useContext } from 'react';
import {
    CircularProgress,
    Box,
} from '@mui/material';
import { TeamContext } from '../context/TeamContext';

const ProblemsOverview = () => {
    const { teamData, loading } = useContext(TeamContext);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Box></Box>
    );
};

export default ProblemsOverview;