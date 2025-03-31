import React, { useContext, useState } from 'react';
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
    ListItemText,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemIcon,
} from '@mui/material';
import { TeamContext } from '../context/TeamContext';

const ProblemsOverview = () => {
    const { teamData, loading } = useContext(TeamContext);

    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [passedFilter, setPassedFilter] = useState('');
    const [expandedSections, setExpandedSections] = useState({}); // { [index]: { symptoms: true, causes: false, ... } }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    const allTests = teamData.evaluation?.tests || [];

    const categories = Array.from(
        new Set(allTests.map(t => t.scrumEvaluationTestCategory?.categoryName).filter(Boolean))
    );

    const failedTests = allTests
        .filter(test => !test.passed)
        .filter(test => {
            const matchesName = test.name.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesCategory = categoryFilter.length > 0
                ? categoryFilter.includes(test.scrumEvaluationTestCategory?.categoryName)
                : true;
            const matchesPassed = passedFilter !== ''
                ? (passedFilter === 'passed' ? test.passed : !test.passed)
                : true;
            return matchesName && matchesCategory && matchesPassed;
        })
        .sort((a, b) => b.severityLevel - a.severityLevel);

    const toggleSection = (index, section) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                [section]: !prev[index]?.[section],
            },
        }));
    };

    return (
        <Box sx={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Filters */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                    <TextField
                        fullWidth
                        label="Filter by Name"
                        variant="outlined"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            multiple
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(
                                    typeof e.target.value === 'string'
                                        ? e.target.value.split(',')
                                        : e.target.value
                                )
                            }
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    <Checkbox checked={categoryFilter.includes(cat)} />
                                    <ListItemText primary={cat} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={passedFilter}
                            onChange={(e) => setPassedFilter(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="passed">Passed</MenuItem>
                            <MenuItem value="failed">Failed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Problem Cards */}
            {failedTests.map((test, index) => {
                const expanded = expandedSections[index] || {};
                const category = test.scrumEvaluationTestCategory?.categoryName || 'Unknown';
                const hasSymptoms = test.symptoms?.length > 0;
                const hasCauses = test.possibleRootCauses?.length > 0;
                const hasConsequences = test.possibleConsequences?.length > 0;

                return (
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
                            backgroundColor: '#f9f9f9',
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

                                {/* Small Category Tag */}
                                <Typography variant="caption" color="text.secondary">
                                    Category: {category}
                                </Typography>

                                {/* Test Name and Descriptions */}
                                <Typography variant="h6" gutterBottom>
                                    {test.name}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {test.definition}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {test.outcomeDescription}
                                </Typography>

                                {/* Toggle Buttons */}
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                    {hasSymptoms && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => toggleSection(index, 'symptoms')}
                                        >
                                            {expanded.symptoms ? 'Hide Symptoms' : 'Show Symptoms'}
                                        </Button>
                                    )}
                                    {hasCauses && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => toggleSection(index, 'causes')}
                                        >
                                            {expanded.causes ? 'Hide Root Causes' : 'Show Root Causes'}
                                        </Button>
                                    )}
                                    {hasConsequences && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => toggleSection(index, 'consequences')}
                                        >
                                            {expanded.consequences ? 'Hide Consequences' : 'Show Consequences'}
                                        </Button>
                                    )}
                                </Box>

                                {/* Detail Sections */}
                                {expanded.symptoms && hasSymptoms && (
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

                                {expanded.causes && hasCauses && (
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

                                {expanded.consequences && hasConsequences && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="subtitle2">Possible Consequences:</Typography>
                                        <List dense>
                                            {test.possibleConsequences.map((consequence, i) => (
                                                <ListItem key={i} sx={{ pl: 0 }}>
                                                    <ListItemText primary={consequence} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )}
                            </Alert>
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
};

export default ProblemsOverview;
