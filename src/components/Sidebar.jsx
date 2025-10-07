import { Link } from 'react-router-dom'
import { 
  HomeIcon, 
  ChartBarIcon, 
  PencilSquareIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Sidebar = ({ activePage, isOpen, setSidebarOpen }) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: HomeIcon, 
      description: 'Overview & Analytics',
      path: '/dashboard'
    },
    { 
      id: 'data-show', 
      name: 'Buyer Data', 
      icon: ChartBarIcon, 
      description: 'View & Manage Data',
      path: '/buyer-data'
    },
    { 
      id: 'data-entry', 
      name: 'Data Entry', 
      icon: PencilSquareIcon, 
      description: 'Add Transactions',
      path: '/data-entry'
    },
    { 
      id: 'add-buyer', 
      name: 'Add Buyer', 
      icon: UserPlusIcon, 
      description: 'Create New Buyer',
      path: '/add-buyer'
    },
    { 
      id: 'purchase-data', 
      name: 'Purchase Data', 
      icon: ShoppingCartIcon, 
      description: 'Company Purchases',
      path: '/purchase-data'
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 font-poppins shadow-sm flex flex-col transform transition-transform duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 lg:mt-8 px-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`
                      group w-full flex items-start px-4 py-4 text-left rounded-xl transition-all duration-200 hover:shadow-sm
                      ${isActive 
                        ? 'bg-black text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg mr-4 transition-all duration-200 flex-shrink-0
                      ${isActive 
                        ? 'bg-white/10' 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium ">{item.name}</div>
                      <div className={`text-xs mt-0.5 ${isActive ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-600'}`}>
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 mt-4"></div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium">
              © 2024 RV Plastics
            </div>
            <div className="text-xs text-gray-500 mt-1">
              All rights reserved
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
