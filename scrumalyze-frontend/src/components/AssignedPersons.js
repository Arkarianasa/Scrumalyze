import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

const AssignedPersons = ({ workItemPersons, persons }) => {
    if (workItemPersons.length === 0) {
        return null; // Return nothing if there are no assigned persons
    }

    return (
        <Box mt={1}>
            <Typography variant="subtitle2" color="textPrimary">
                Assigned Persons
            </Typography>
            <List>
                {workItemPersons.map((item) => {
                    const person = persons.find(p => p.personID === item.personID);
                    return person ? (
                        <ListItem key={person.personID}>
                            <ListItemAvatar>
                                <Avatar>
                                    {person.firstName.charAt(0)}
                                    {person.lastName.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${person.firstName} ${person.lastName}`}
                                secondary={person.role ? person.role.roleName : 'No role assigned'}
                            />
                        </ListItem>
                    ) : (
                        <ListItem key={item.personID}>
                            <ListItemText primary={`Person ID: ${item.personID}`} secondary="Unassigned" />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default AssignedPersons;