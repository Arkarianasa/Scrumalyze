import React, { useContext } from 'react';
import {
    CircularProgress,
    Box,
    Typography,
    Card,
    CardContent,
    Alert,
    AlertTitle,
    List,
    ListItem,
    ListItemText
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

    return (
        <Box sx={{ padding: '5px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {failedTests.map((test, index) => (
                <Card
                    key={index}
                    sx={{
                        borderLeft: `4px solid ${
                            test.severity === 'Critical'
                                ? '#d32f2f'
                                : test.severity === 'Major'
                                ? '#f57c00'
                                : '#1976d2'
                        }`,
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <CardContent>
                        <Alert
                            severity={
                                test.severity === 'Critical'
                                    ? 'error'
                                    : test.severity === 'Major'
                                    ? 'warning'
                                    : 'info'
                            }
                        >
                            <AlertTitle>
                                {test.severity} Pathological Behaviour
                            </AlertTitle>

                            {/* Test Name and Description */}
                            <Typography variant="h6" gutterBottom>
                                {test.name}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                                {test.definition}
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                                {test.outcomeDescription}
                            </Typography>

                            {/* Symptoms */}
                            {test.symptoms && test.symptoms.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2">Symptoms:</Typography>
                                    <List dense>
                                        {test.symptoms.map((symptom, i) => (
                                            <ListItem key={i} sx={{ pl: 0 }}>
                                                <ListItemText primary={symptom} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            {/* Possible Root Causes */}
                            {test.possibleRootCauses && test.possibleRootCauses.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2">Possible Root Causes:</Typography>
                                    <List dense>
                                        {test.possibleRootCauses.map((cause, i) => (
                                            <ListItem key={i} sx={{ pl: 0 }}>
                                                <ListItemText primary={cause} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                            {/* Possible Consequences */}
                            {test.possibleConsequences && test.possibleConsequences.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2">Possible Consequences:</Typography>
                                    <List dense>
                                        {test.possibleConsequences.map((cause, i) => (
                                            <ListItem key={i} sx={{ pl: 0 }}>
                                                <ListItemText primary={cause} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </Alert>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default ProblemsOverview;
