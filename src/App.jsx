import React, { useContext } from 'react'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './generalpages/landingpagee.jsx'
import Signup from './generalpages/signup.jsx'
import Login from './generalpages/login.jsx'
import Dashboard from './generalpages/user/userdashboard.jsx'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './context/authContext.jsx'

function App() {
  const { user } = useContext(AuthContext);
  const ActiveUser = user?.data?.user || null;

  console.log("User:", ActiveUser);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={ActiveUser ? <Dashboard /> : <Navigate to="/login" />} />
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
