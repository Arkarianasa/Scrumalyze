import React, { useContext } from 'react';
import {
    CircularProgress,
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
} from '@mui/material';
import { TeamContext } from '../context/TeamContext';

const TestsOverview = () => {
    const { teamData, loading } = useContext(TeamContext);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    const tests = teamData.evaluation?.tests || [];

    return (
        <Box sx={{ padding: '5px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Grid container spacing={2}>
                {tests.map((test, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between',
                                border: test.passed ? '2px solid #4caf50' : '2px solid #f44336',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    color={test.passed ? 'success.main' : 'error.main'}
                                    gutterBottom
                                >
                                    {test.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {test.outcomeDescription}
                                </Typography>
                                <Chip
                                    label={test.passed ? 'Passed' : 'Failed'}
                                    color={test.passed ? 'success' : 'error'}
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TestsOverview;
