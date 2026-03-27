import { useEffect } from "react"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Tab,
  Tabs,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LinkedIn, Facebook, GitHub } from '@mui/icons-material';

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  minHeight: 64,
  '&.Mui-selected': {
    color: theme.palette.primary.contrastText,
  },
}));

function Home() {
    const navigateTo = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            navigateTo('tasks');
        }
    }, [navigateTo, location])

    const navItems = [
        { label: 'Tasks', path: 'tasks' },
        { label: 'Tags', path: 'tags' },
        { label: 'Users', path: 'users' },
    ];

    const getCurrentTab = () => {
        const currentPath = location.pathname.split('/')[1];
        const tabIndex = navItems.findIndex(item => item.path === currentPath);
        return tabIndex !== -1 ? tabIndex : 0;
    };

    const handleTabChange = (event, newValue) => {
        navigateTo(navItems[newValue].path);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            <AppBar position="static" elevation={2}>
                <Toolbar>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1,
                            fontWeight: 600,
                            color: 'primary.contrastText'
                        }}
                    >
                        Hi, User
                    </Typography>
                    <Tabs 
                        value={getCurrentTab()} 
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: 'primary.contrastText',
                                height: 3,
                            },
                        }}
                    >
                        {navItems.map((item, index) => (
                            <StyledTab
                                key={index}
                                label={item.label}
                                sx={{ color: 'primary.contrastText' }}
                            />
                        ))}
                    </Tabs>
                </Toolbar>
            </AppBar>
            
            <Container 
                maxWidth="lg" 
                sx={{ 
                    flexGrow: 1,
                    py: 4,
                    px: { xs: 2, sm: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: 0,
                }}
            >
                <Paper 
                    elevation={3}
                    sx={{ 
                        width: '105%',
                        maxWidth: '1400px',
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'calc(100vh - 140px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        margin: '0 auto',
                        overflow: 'hidden'
                    }}
                >
                    <Outlet />
                </Paper>
            </Container>
            
            {/* Social Media Links */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    zIndex: 1000,
                }}
            >
                <Tooltip title="LinkedIn Profile" placement="left">
                    <IconButton
                        onClick={() => window.open('https://www.linkedin.com/in/andrey-ivanov-156545216/', '_blank')}
                        sx={{
                            backgroundColor: '#0077B5',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#005885',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        <LinkedIn />
                    </IconButton>
                </Tooltip>
                
                <Tooltip title="Facebook Profile" placement="left">
                    <IconButton
                        onClick={() => window.open('https://www.facebook.com/andryusha.ivanov', '_blank')}
                        sx={{
                            backgroundColor: '#1877F2',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#166FE5',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        <Facebook />
                    </IconButton>
                </Tooltip>
                
                <Tooltip title="GitHub Profile" placement="left">
                    <IconButton
                        onClick={() => window.open('https://github.com/andreyIvnov?tab=repositories', '_blank')}
                        sx={{
                            backgroundColor: '#333',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#24292e',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        <GitHub />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}
export default Home