import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import Applications from './pages/Applications';
import Sessions from './pages/Sessions';
import AccessDenied from './pages/AccessDenied';


const App = () => {
  return (
    <BrowserRouter basename="/users">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/roles" element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Roles />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/permissions" element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Permissions />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Applications />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/sessions" element={
            <ProtectedRoute>
              <Layout>
                <Sessions />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/access-denied" element={<AccessDenied />} />



          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
