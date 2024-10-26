import React, { useContext } from 'react';
import { Container, Box } from '@mui/material';
import MainPage from './components/MainPage';
import TeamDashboardPage from './components/TeamDashboardPage';
import NewTeamPage from './components/NewTeamPage';
import { GlobalContext } from './context/GlobalContext';
import { TeamProvider } from './context/TeamContext';
import backgroundImage from './background.jpg';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainBar from './components/MainBar';

function App() {
    const { currentPage, setCurrentPage } = useContext(GlobalContext);

    const theme = createTheme({
        typography: {
          fontFamily: 'Montserrat, Arial, sans-serif', // Set the font family here
        },
      });

    const renderPage = () => {
        switch (currentPage) {
            case 'main':
                return (
                    <Box sx={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'auto',
                        backgroundRepeat: 'repeat',
                        backgroundPosition: 'top left',
                        minHeight: '100vh',
                      }}>
                        <MainPage />
                    </Box>
                );
            case 'team-dashboard':
                return (
                    <Box>
                        <MainBar />
                        < TeamProvider >
                            <TeamDashboardPage />
                        </TeamProvider >
                    </Box>
                );
            case 'new-team':
                return (
                    <Box sx={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'auto',
                        backgroundRepeat: 'repeat',
                        backgroundPosition: 'top left',
                        minHeight: '100vh',
                      }}>
                        <MainBar />
                        <NewTeamPage />
                    </Box>
                );
            default:
                return <MainPage />;
        }
    };
  return (
    <ThemeProvider theme={theme}>
          {renderPage()}
    </ThemeProvider>

  );
}

export default App;
