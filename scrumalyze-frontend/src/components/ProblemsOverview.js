import React, { useContext } from 'react';
import {
    CircularProgress,
    Box,
    Typography,
    Card,
    CardContent,
    Alert,
    AlertTitle
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

    // Filter and sort tests that did not pass by severity (descending)
    const failedTests = teamData.evaluation.tests
    .filter(test => !test.passed)
    .sort((a, b) => b.severityLevel - a.severityLevel);

    // Severity level mapping
    const severityMap = {
        1: 'Minor Problem',
        2: 'Major Problem',
        3: 'Critical Problem'
    };

    return (
        <Box sx={{ padding: '5px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {failedTests.map((test, index) => (
                <Card
                    key={index}
                    sx={{
                        borderLeft: `4px solid ${
                            test.severityLevel === 3
                                ? '#d32f2f'
                                : test.severityLevel === 2
                                ? '#f57c00'
                                : '#1976d2'
                        }`,
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <CardContent>
                        <Alert severity={
                            test.severityLevel === 3
                                ? 'error'
                                : test.severityLevel === 2
                                ? 'warning'
                                : 'info'
                        }>
                            <AlertTitle>
                                {severityMap[test.severityLevel] || 'Unknown Severity'}
                            </AlertTitle>
                            <Typography variant="h6">{test.name}</Typography>
                            <Typography variant="body2">{test.details}</Typography>
                        </Alert>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default ProblemsOverview;
