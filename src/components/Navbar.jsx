import { 
  UserCircleIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Navbar = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth()

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 md:pl-5 md:pr-8 py-4 font-poppins flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Mobile menu button and Logo */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-gray-500 rounded-lg flex items-center justify-center shadow-sm">
              <BuildingOfficeIcon className="w-6 h-6 md:w-8 md:h-8 text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-medium text-gray-900">RG Plastics</h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">Management System</p>
            </div>
          </div>
        </div>

        {/* Right side - User Profile */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user?.username || 'Admin User'}</p>
            <p className="text-xs text-gray-500">RV Plastics Management</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
              <UserCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="relative group">
              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
