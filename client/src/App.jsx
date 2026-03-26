import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import './styles/theme.css'
import './styles/global.css'
import './App.css'
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
    <>
      <div className="app-container">
        <Routes>
          <Route path='/' element={<Home />}>
            <Route path='tasks' element={<Tasks />} />
            <Route path='tasks/:id' element={<EditTasks/>}/> 
            <Route path='tags' element={<Tags/>} />
            <Route path='users' element={<Users />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
