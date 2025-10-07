import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'

const PurchaseData = () => {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    purchaserName: '',
    date: new Date().toLocaleDateString('en-CA'),
    productName: '',
    cost: '',
    productColor: '',
    masterPage: '',
    ld: '',
    hm: ''
  })

  // Google Apps Script URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx89vJ41DN0_1u-qxngjETha-YUu3oWddvgi9aF74uyFBnRuYIu7hTj6e5VS7jTMHwa/exec'

  // Fetch purchases from Google Sheets
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=purchases`)
        const data = await response.json()
        
        if (data && !data.error && data.length > 0) {
          setPurchases(data)
          console.log('Fetched purchases from Google Sheets:', data)
        } else {
          console.log('No purchases found in Google Sheets')
          setPurchases([])
        }
      } catch (error) {
        console.error('Error fetching purchases:', error)
        setError('Failed to fetch purchases from Google Sheets')
        setPurchases([])
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      const purchase = {
        purchaserName: formData.purchaserName,
        date: new Date(formData.date).toLocaleDateString('en-GB'),
        productName: formData.productName,
        cost: parseFloat(formData.cost) || 0,
        productColor: formData.productColor,
        masterPage: formData.masterPage,
        ld: formData.ld,
        hm: formData.hm
      }
      
      // Send to Google Sheets using JSONP to avoid CORS issues
      const result = await new Promise((resolve, reject) => {
        const callbackName = `handlePurchaseResult_${Date.now()}`
        
        // Create the purchase data as URL parameters
        const params = new URLSearchParams({
          action: 'addPurchase',
          callback: callbackName,
          ...purchase
        })
        
        // Create script tag for JSONP
        const script = document.createElement('script')
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`
        
        script.onerror = () => {
          reject(new Error('Failed to add purchase'))
          document.head.removeChild(script)
        }
        
        // Global callback function
        window[callbackName] = (data) => {
          resolve(data)
          document.head.removeChild(script)
          delete window[callbackName]
        }
        
        document.head.appendChild(script)
      })
      
      if (result.success) {
        console.log('Purchase added to Google Sheets:', result)
        
        // Add to local state for immediate display
        setPurchases(prev => [...prev, {
          id: Date.now(),
          ...purchase
        }])
        
        setShowSuccess(true)
        setFormData({
          purchaserName: '',
          date: new Date().toLocaleDateString('en-CA'),
          productName: '',
          cost: '',
          productColor: '',
          masterPage: '',
          ld: '',
          hm: ''
        })
        setShowForm(false)
        
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        throw new Error(result.error || 'Failed to add purchase')
      }
    } catch (error) {
      console.error('Error adding purchase:', error)
      setError(`Failed to add purchase: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Filter purchases based on search term
  const filteredPurchases = purchases.filter(purchase =>
    purchase.purchaserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productColor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && purchases.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading purchases...</div>
      </div>
    )
  }

  if (error && purchases.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          <div>{error}</div>
          <div className="text-sm text-gray-500 mt-2">Check browser console for details</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Data</h1>
          <p className="text-gray-600 mt-2">Manage company purchase records and inventory</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Purchase
        </button>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">Purchase added successfully!</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <XMarkIcon className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800 font-medium">{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search purchases by purchaser, product, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredPurchases.length} purchase{filteredPurchases.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Purchase Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchaser</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Master Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HM</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase, index) => (
                <tr key={purchase.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {purchase.purchaserName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{purchase.cost?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.productColor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.masterPage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.ld}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.hm}
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    {loading ? 'Loading purchases...' : 'No purchases found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Add New Purchase</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Purchaser Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchaser Name *
                  </label>
                  <input
                    type="text"
                    name="purchaserName"
                    value={formData.purchaserName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter purchaser name"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost (₹) *
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter cost"
                  />
                </div>

                {/* Product Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Color *
                  </label>
                  <input
                    type="text"
                    name="productColor"
                    value={formData.productColor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product color"
                  />
                </div>

                {/* Master Page */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Master Page
                  </label>
                  <input
                    type="text"
                    name="masterPage"
                    value={formData.masterPage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter master page"
                  />
                </div>

                {/* LD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LD
                  </label>
                  <input
                    type="text"
                    name="ld"
                    value={formData.ld}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter LD"
                  />
                </div>

                {/* HM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HM
                  </label>
                  <input
                    type="text"
                    name="hm"
                    value={formData.hm}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter HM"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Purchase
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseData
