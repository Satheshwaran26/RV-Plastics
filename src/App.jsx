import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import BuyerData from './components/Buyer-Data'
import DataEntry from './components/DataEntry'
import AddBuyer from './components/AddBuyer'
import PurchaseData from './components/Purchase-Data'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

// Context
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <div className="font-poppins">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/buyer-data" element={
              <ProtectedRoute>
                <Layout>
                  <BuyerData />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/data-entry" element={
              <ProtectedRoute>
                <Layout>
                  <DataEntry />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/add-buyer" element={
              <ProtectedRoute>
                <Layout>
                  <AddBuyer />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/purchase-data" element={
              <ProtectedRoute>
                <Layout>
                  <PurchaseData />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
