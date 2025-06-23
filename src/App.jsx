import React, { useContext } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate, } from 'react-router-dom';
import './App.css';

//page imports
import LandingPage from './generalpages/landingpagee.jsx';
import Signup from './generalpages/signup.jsx';
import Login from './generalpages/login.jsx';
import Dashboard from './generalpages/user/userdashboard.jsx';
import WelcomePage from './generalpages/user/userTest.jsx';
import TestComponent from './components/testComponent.jsx';
import RecommendationsPage from './generalpages/user/userRecommendations.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './context/authContext.jsx';


function App() {
  const { user } = useContext(AuthContext);
  const ActiveUser = user?.data?.user || null;

  const hasTakenTest = ActiveUser?.takentest;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Welcome Page: For users who are logged in but haven't taken the test */}
        <Route
          path="/welcome-page"
          element={
            ActiveUser ? (
              hasTakenTest ? <Navigate to="/dashboard" /> : <WelcomePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Dashboard: Only if user has taken the test */}
        <Route
          path="/dashboard"
          element={
            ActiveUser ? (
              hasTakenTest ? <Dashboard /> : <Navigate to="/welcome-page" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Test route */}
        <Route
          path="/test"
          element={ActiveUser ? <TestComponent /> : <Navigate to="/login" />}
        />

        <Route 
          path="/recommendations" 
          element={ ActiveUser ? <RecommendationsPage /> : <Navigate to="/login" />} /> 

        {/* 404 fallback */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
