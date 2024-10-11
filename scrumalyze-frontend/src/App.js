import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [evaluationResults, setEvaluationResults] = useState([]);

    useEffect(() => {
        // Function to fetch evaluation results from the API
        const fetchEvaluationResults = async () => {
            try {
                const teamName = "Atomic"; // Replace with the actual team name you want to test
                const response = await axios.get(`https://localhost:52765/api/evaluation/${teamName}`);
                setEvaluationResults(response.data);
            } catch (error) {
                console.error('Error fetching evaluation results:', error);
            }
        };

        fetchEvaluationResults();
    }, []);

    return (
        <div>
            <h1>Scrum Evaluation Results</h1>
            <ul>
                {JSON.stringify(evaluationResults)}
            </ul>
        </div>
    );
}

export default App;
