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
        evaulation: null
    });
    const [loading, setLoading] = useState(true);

    const fetchTeamData = async (teamId) => {
        try {
            const responses = await Promise.all([
                fetch(`https://localhost:52765/api/teamcontext/persons/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/productgoal/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/dod/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/acceptancecriteria/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/timeboxes/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/productbacklog/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/workitems/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/sprints/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/sprintbacklogs/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/sprintgoals/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/processsteps/${teamId}`),
                fetch(`https://localhost:52765/api/teamcontext/increments/${teamId}`),
                fetch(`https://localhost:52765/api/evaluation/${teamId}`),
            ]);

            const [
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
                evaulation,
            ] = await Promise.all(responses.map((res) => res.json()));

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
                evaulation,
            });
        } catch (error) {
            console.error('Failed to fetch team data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTeam) {
            setLoading(true); // Set loading state before fetching
            fetchTeamData(selectedTeam); // Fetch team data based on selectedTeam
        }
    }, [selectedTeam]); // Re-run effect when selectedTeam changes

    return (
        <TeamContext.Provider value={{ teamData, loading }}>
            {children}
        </TeamContext.Provider>
    );
};
