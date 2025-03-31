import React, { useContext, useState } from 'react';
import {
    CircularProgress,
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
} from '@mui/material';
import { TeamContext } from '../context/TeamContext';

const TestsOverview = () => {
    const { teamData, loading } = useContext(TeamContext);
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [passedFilter, setPassedFilter] = useState('');

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    const tests = teamData.evaluation?.tests || [];

    const categories = Array.from(new Set(tests.map(t => t.scrumEvaluationTestCategory?.categoryName).filter(Boolean)));

    const filteredTests = tests.filter(test => {
        const matchesName = test.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesCategory = categoryFilter.length > 0
            ? categoryFilter.includes(test.scrumEvaluationTestCategory?.categoryName)
            : true;
        const matchesPassed = passedFilter !== ''
            ? (passedFilter === 'passed' ? test.passed : !test.passed)
            : true;
        return matchesName && matchesCategory && matchesPassed;
    });

    return (
        <Box sx={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                            label="Category"
                        >
                            {categories.map((cat, index) => (
                                <MenuItem key={index} value={cat}>
                                    <Checkbox checked={categoryFilter.indexOf(cat) > -1} />
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

            <Grid container spacing={2}>
                {filteredTests.map((test, index) => (
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
                                <Typography variant="caption" color="text.secondary">
                                    {test.scrumEvaluationTestCategory?.categoryName}
                                </Typography>
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
