import React, { useState, useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { GlobalContext } from '../context/GlobalContext';
import logo from '../logo.png';

const MainPage = () => {
    const { scrumTeams, setCurrentPage, setSelectedTeam } = useContext(GlobalContext);
    const [selectedTeamID, setSelectedTeamID] = useState('');

    const handleOpenTeam = () => {
        if (selectedTeamID !== '') {
            setSelectedTeam(selectedTeamID);
            setCurrentPage('team-dashboard');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12%' }}>
            <Card variant="outlined" style={{ width: '50%', marginBottom: '70px' }} >
                <CardMedia component="img" alt="logo" image={logo} />
                <CardContent>
                    <Typography variant="h5" component="div" align="center">
                        Welcome to Scrumalyze
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Select a team to get started
                    </Typography>
                    <FormControl fullWidth variant="outlined" style={{ marginTop: '15px' }}>
                        <InputLabel id="team-select-label">Select Team</InputLabel>
                        <Select
                            labelId="team-select-label"
                            value={selectedTeamID}
                            onChange={(event) => setSelectedTeamID(event.target.value)}
                            label="Select Team"
                        >
                            {scrumTeams.map((team) => (
                                <MenuItem key={team.scrumTeamID} value={team.scrumTeamID}>
                                    {team.teamName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '15px', width: '100%', height: '50px' }}
                        onClick={handleOpenTeam}
                    >
                        Open Team
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginTop: '15px', width: '100%', height: '50px' }}
                        onClick={() => setCurrentPage('new-team')}
                    >
                        New Team
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default MainPage;
