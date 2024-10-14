import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('main'); // Default page
    const [selectedTeam, setSelectedTeam] = useState('');
    const [scrumTeams, setScrumTeams] = useState([]); // List of ScrumTeams
    const [scrumRoles, setScrumRoles] = useState([]); // List of ScrumRoles
    const [workItemTypes, setWorkItemTypes] = useState([]); // List of WorkItemTypes

    // Fetch global data from the API
    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const response = await fetch('https://localhost:52765/api/globalContext');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Set the data in the state
                setScrumTeams(data.scrumTeams);
                setScrumRoles(data.scrumRoles);
                setWorkItemTypes(data.workItemTypes);
            } catch (error) {
                console.error('Failed to fetch global context:', error);
            }
        };

        fetchGlobalData();
    }, []); // Fetch data only once on mount

    return (
        <GlobalContext.Provider value={{ currentPage, setCurrentPage, selectedTeam, setSelectedTeam, scrumTeams, scrumRoles, workItemTypes }}>
            {children}
        </GlobalContext.Provider>
    );
};
