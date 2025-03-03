import React, { createContext, useState, useEffect } from 'react';

// Create the GlobalContext
export const GlobalContext = createContext();

// Create the GlobalProvider component
export const GlobalProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('main'); // Default page
    const [selectedTeam, setSelectedTeam] = useState(''); // Holds the currently selected team
    const [scrumTeams, setScrumTeams] = useState([]); // List of ScrumTeams
    const [scrumRoles, setScrumRoles] = useState([]); // List of ScrumRoles
    const [workItemTypes, setWorkItemTypes] = useState([]); // List of WorkItemTypes
    const [processStepTypes, setProcessStepTypes] = useState([]); // List of WorkItemTypes
    const [prioritizationSchemes, setPrioritizationSchemes] = useState([]); // List of PrioritizationSchemes

    // Fetch global data from the API
    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const response = await fetch('https://localhost:52765/api/global');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                setScrumTeams(data.scrumTeams);
                setScrumRoles(data.scrumRoles);
                setWorkItemTypes(data.workItemTypes);
                setProcessStepTypes(data.processStepTypes);
                setPrioritizationSchemes(data.prioritizationSchemes);
            } catch (error) {
                console.error('Failed to fetch global context data:', error);
            }
        };

        fetchGlobalData();
    }, []); // Run this effect only once on component mount

    return (
        <GlobalContext.Provider
            value={{
                currentPage,
                setCurrentPage,
                selectedTeam,
                setSelectedTeam,
                scrumTeams,
                setScrumTeams,
                scrumRoles,
                workItemTypes,
                processStepTypes,
                prioritizationSchemes
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
