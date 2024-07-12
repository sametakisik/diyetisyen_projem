import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import FoodSelect from './components/FoodSelect';
import Register from './components/Register';
import AgeHeightWeight from './components/AgeHeightWeight';
import { UserProvider } from './components/UserContext';
import RequestDietician from './components/RequestDietician';
import DieticianHomePage from './components/DieticianHomePage';
import Advisors from './components/Advisors';  // Import the Advisors component
import TopMenu from './components/TopMenu';
import UserHomepage from './components/UserHomepage';
import Profile from './components/Profile';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/FoodSelect" element={<FoodSelect />} />
          <Route path="/age-height-weight" element={<AgeHeightWeight />} />
          <Route path="/request-dietician" element={<RequestDietician />} />
          <Route path="/dietician-homepage" element={<DieticianHomePage />} />
          <Route path="/home" element={<TopMenu />} />
          <Route path="/advisors" element={<Advisors />} />
          <Route path="/user-homepage" element={<UserHomepage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
