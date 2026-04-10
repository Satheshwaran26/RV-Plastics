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
    selectedName: '',
    selectedMaterial: '',
    cost: '',
    date: new Date().toLocaleDateString('en-CA')
  })

  // Name options
  const nameOptions = [
    'Selvema & Co',
    'Manikandan', 
    'Ypgendran',
    'Kirubaharab-Thukundi',
    'Pandid',
    'Sudha Plastics',
    'Ramesh',
    'Gobi',
    'Varathan'
  ]

  // Material options based on selected name
  const getMaterialOptions = (selectedName) => {
    if (selectedName === 'Selvema & Co') {
      return ['Pigment Blue']
    } else if (selectedName === 'Manikandan') {
      return ['Pigment Blue', 'Pigment Green', 'Pigment Red', 'Master Page Milk White', 'Master Page Black']
    } else if (selectedName === 'Yogendran') {
      return ['Master Page Milk White', 'Master Page Black']
    } else if (selectedName === 'Kirubaharab-Thukundi') {
      return ['Pillar 1 Quality', 'Pillar 2nd Quality']
    } else if (selectedName === 'Pandid') {
      return ['Dull LD']
    } else if (['Sudha Plastics', 'Ramesh', 'Gobi', 'Varathan'].includes(selectedName)) {
      return [
        'Dull LD',
        'White LD', 
        'Vergin LD',
        'Vergin LLD',
        'Vergin HM',
        'Blue LD',
        'Red LD',
        'Black LD',
        'Green LD',
        'Yellow LD',
        'Milk White LD',
        'Material Bag LD'
      ]
    }
    return []
  }


  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx89vJ41DN0_1u-qxngjETha-YUu3oWddvgi9aF74uyFBnRuYIu7hTj6e5VS7jTMHwa/exec'

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
      [name]: value,
      // Reset material selection when name changes
      ...(name === 'selectedName' && { selectedMaterial: '' })
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      const purchase = {
        purchaserName: formData.selectedName,
        date: new Date(formData.date).toLocaleDateString('en-GB'),
        productName: formData.selectedMaterial,
        cost: parseFloat(formData.cost) || 0,
        productColor: formData.selectedMaterial,
        masterPage: '',
        ld: '',
        hm: ''
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
          selectedName: '',
          selectedMaterial: '',
          cost: '',
          date: new Date().toLocaleDateString('en-CA')
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
    purchase.purchaserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productColor?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-2">Purchase Data</h1>
          <p className="text-gray-600 text-lg">Manage company purchase records and inventory</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-6">
            <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Purchase added successfully!</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
            <XMarkIcon className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        {/* Purchase Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Add New Purchase</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Name Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Select Name *
                </label>
                <select
                  name="selectedName"
                  value={formData.selectedName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Choose a name...</option>
                  {nameOptions.map((name) => (
                    <option key={name} value={name} className="text-black">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Material/Color Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Select Material / Color *
                </label>
                <select
                  name="selectedMaterial"
                  value={formData.selectedMaterial}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.selectedName}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.selectedName ? 'Choose material...' : 'Select name first...'}
                  </option>
                  {getMaterialOptions(formData.selectedName).map((material) => (
                    <option key={material} value={material} className="text-black">
                      {material}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cost Input */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Cost (₹) *
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter cost"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Summary */}
            {formData.selectedName && formData.selectedMaterial && formData.cost && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 font-semibold">
                  Selected: <span className="text-blue-600">{formData.selectedName}</span> → <span className="text-blue-600">{formData.selectedMaterial}</span> → <span className="text-blue-600">₹{Number(formData.cost).toLocaleString()}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading || !formData.selectedName || !formData.selectedMaterial || !formData.cost}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Purchase...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Purchase
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search purchases by name, material, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {filteredPurchases.length} purchase{filteredPurchases.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Purchases Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-black">Purchase Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.map((purchase, index) => (
                  <tr key={purchase.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {purchase.purchaserName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {purchase.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {purchase.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                      ₹{purchase.cost?.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filteredPurchases.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                      {loading ? 'Loading purchases...' : 'No purchases found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseData

