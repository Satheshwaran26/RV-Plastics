import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  // Get current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname
    switch (path) {
      case '/':
      case '/dashboard':
        return 'dashboard'
      case '/buyer-data':
        return 'data-show'
      case '/data-entry':
        return 'data-entry'
      case '/add-buyer':
        return 'add-buyer'
      default:
        return 'dashboard'
    }
  }

  const currentPage = getCurrentPage()

  return (
    <div className="min-h-screen bg-white text-black font-poppins flex flex-col">
      {/* Full width navbar at top */}
      <Navbar 
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      
      {/* Content area with sidebar and main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activePage={currentPage}
          isOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
