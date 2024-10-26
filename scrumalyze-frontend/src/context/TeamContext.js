import React, { createContext, useContext, useEffect, useState } from 'react';
import { GlobalContext } from './GlobalContext';

export const TeamContext = createContext();

export const useTeamContext = () => {
    return useContext(TeamContext);
};

export const TeamProvider = ({ children }) => {
    const { selectedTeam } = useContext(GlobalContext);
    const [teamData, setTeamData] = useState({
        persons: [],
        productGoal: null,
        dodList: [],
        acceptanceCriteria: [],
        timeboxes: [],
        productBacklog: null,
        workItems: [],
        sprints: [],
        sprintBacklogs: [],
        sprintGoals: [],
        processSteps: [],
        increments: [],
        evaluation: null,
    });
    const [loading, setLoading] = useState(true);

    const fetchTeamData = async (teamId) => {
        try {
            const endpoints = [
                `https://localhost:52765/api/team/persons/${teamId}`,
                `https://localhost:52765/api/team/productgoal/${teamId}`,
                `https://localhost:52765/api/team/dod/${teamId}`,
                `https://localhost:52765/api/team/acceptancecriteria/${teamId}`,
                `https://localhost:52765/api/team/timeboxes/${teamId}`,
                `https://localhost:52765/api/team/productbacklog/${teamId}`,
                `https://localhost:52765/api/team/workitems/${teamId}`,
                `https://localhost:52765/api/team/sprints/${teamId}`,
                `https://localhost:52765/api/team/sprintbacklogs/${teamId}`,
                `https://localhost:52765/api/team/sprintgoals/${teamId}`,
                `https://localhost:52765/api/team/processsteps/${teamId}`,
                `https://localhost:52765/api/team/increments/${teamId}`,
                `https://localhost:52765/api/evaluation/${teamId}`
            ];
    
            // Fetch data for each endpoint, handling empty or invalid JSON
            const responses = await Promise.all(endpoints.map(async (url) => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
                    return await res.json(); // Attempt to parse JSON
                } catch (error) {
                    //console.warn(`Error fetching from ${url}:`, error);
                    return null; // Return null if parsing fails
                }
            }));
    
            // Destructure and assign defaults for potentially empty data
            const [
                persons = [],
                productGoal = null,
                dodList = [],
                acceptanceCriteria = [],
                timeboxes = [],
                productBacklog = null,
                workItems = [],
                sprints = [],
                sprintBacklogs = [],
                sprintGoals = [],
                processSteps = [],
                increments = [],
                evaluation = null
            ] = responses;
    
            // Update team data with defaults where necessary
            setTeamData({
                persons,
                productGoal,
                dodList,
                acceptanceCriteria,
                timeboxes,
                productBacklog,
                workItems,
                sprints,
                sprintBacklogs,
                sprintGoals,
                processSteps,
                increments,
                evaluation,
            });
        } catch (error) {
            //console.error('Failed to fetch team data:', error);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        if (selectedTeam.scrumTeamID) {
            setLoading(true); // Set loading state before fetching
            fetchTeamData(selectedTeam.scrumTeamID); // Fetch team data based on selectedTeam
        }
    }, [selectedTeam.selectedTeamID]); // Re-run effect when selectedTeam changes

    return (
        <TeamContext.Provider value={{ teamData, loading }}>
            {children}
        </TeamContext.Provider>
    );
};

