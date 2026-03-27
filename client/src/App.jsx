import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import theme from './theme/theme';
import loadAllData from './utils/loadAllData';
import Home from './pages/Home'
import Tasks from './components/Tasks/Tasks';
import EditTasks from './components/Tasks/EditTask';
import Tags from './components/Tags/Tags';
import Users from './components/Users/Users';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAll = async () => {
      await loadAllData(dispatch);
    }
    fetchAll();
  }, [])
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Routes>
          <Route path='/' element={<Home />}>
            <Route path='tasks' element={<Tasks />} />
            <Route path='tasks/:id' element={<EditTasks/>}/> 
            <Route path='tags' element={<Tags/>} />
            <Route path='users' element={<Users />} />
          </Route>
        </Routes>
      </Box>
    </ThemeProvider>
  )
}

export default App
