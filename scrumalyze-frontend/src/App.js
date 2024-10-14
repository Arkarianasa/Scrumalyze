import React, { useContext } from 'react';
import { Container } from '@mui/material';
import MainPage from './components/MainPage';
import TeamDashboardPage from './components/TeamDashboardPage';
import NewTeamPage from './components/NewTeamPage';
import { GlobalContext } from './context/GlobalContext';
import { TeamProvider } from './context/TeamContext';
function App() {
    const { currentPage, setCurrentPage } = useContext(GlobalContext);

    const renderPage = () => {
        switch (currentPage) {
            case 'main':
                return <MainPage />;
            case 'team-dashboard':
                return (
                    < TeamProvider >
                        <TeamDashboardPage />
                    </TeamProvider >
                );
            case 'new-team':
                return <NewTeamPage />;
            default:
                return <MainPage />; // Fallback to MainPage
        }
    };
  return (
      <Container>
          {renderPage()}
          <button onClick={() => setCurrentPage('main')}>Go to Main Page</button>
          <button onClick={() => setCurrentPage('team-dashboard')}>Go to Team Dashboard</button>
          <button onClick={() => setCurrentPage('new-team')}>Go to New Team Page</button>
      </Container>

  );
}

export default App;
