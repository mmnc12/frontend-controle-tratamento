import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout';
import './index.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Localidades from './pages/Localidades';
import PSFs from './pages/PSFs';
import RedeBasica from './pages/RedeBasica'; // <-- NOVO

// ============================================
// COMPONENTE PARA ROTAS PRIVADAS
// ============================================

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/localidades"
        element={
          <PrivateRoute>
            <Layout>
              <Localidades />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/psf"
        element={
          <PrivateRoute>
            <Layout>
              <PSFs />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/rede-basica"
        element={
          <PrivateRoute>
            <Layout>
              <RedeBasica />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

// ============================================
// APP
// ============================================

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1e293b',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;