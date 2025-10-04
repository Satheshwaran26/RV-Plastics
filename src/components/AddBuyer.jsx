import { useState } from 'react'
import { 
  PlusIcon,
  CheckIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const AddBuyer = () => {
  const [formData, setFormData] = useState({
    buyerName: '',
    transactionType: 'SALES',
    weight: '',
    inrPerKg: '95',
    autoRent: '',
    debit: '',
    credit: '',
    particulars: 'SALES'
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionHistory, setTransactionHistory] = useState([])

  const transactionTypes = ['SALES', 'RECEIPT']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      }
      
      // Auto-calculate debit for SALES transactions
      if (name === 'weight' && prev.transactionType === 'SALES') {
        const weight = parseFloat(value) || 0
        const inrPerKg = parseFloat(prev.inrPerKg) || 95
        newData.debit = (weight * inrPerKg).toFixed(2)
      }
      
      // Auto-calculate debit for SALES transactions when INR/kg changes
      if (name === 'inrPerKg' && prev.transactionType === 'SALES') {
        const weight = parseFloat(prev.weight) || 0
        const inrPerKg = parseFloat(value) || 95
        newData.debit = (weight * inrPerKg).toFixed(2)
      }
      
      return newData
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const transaction = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      buyerName: formData.buyerName,
      particulars: formData.transactionType,
      weight: formData.transactionType === 'SALES' ? formData.weight : '',
      inrPerKg: formData.transactionType === 'SALES' ? formData.inrPerKg : '',
      autoRent: formData.autoRent || '',
      debit: formData.transactionType === 'SALES' ? formData.debit : '',
      credit: formData.transactionType === 'RECEIPT' ? formData.credit : '',
      balance: 0 // This would be calculated based on previous balance
    }
    
    setTransactionHistory(prev => [...prev, transaction])
    setShowSuccess(true)
    setFormData({
      buyerName: '',
      transactionType: 'SALES',
      weight: '',
      inrPerKg: '95',
      autoRent: '',
      debit: '',
      credit: '',
      particulars: 'SALES'
    })
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const clearForm = () => {
    setFormData({
      buyerName: '',
      transactionType: 'SALES',
      weight: '',
      inrPerKg: '95',
      autoRent: '',
      debit: '',
      credit: '',
      particulars: 'SALES'
    })
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Buyer & Transaction</h1>
        <p className="text-gray-600 mt-2">Add buyer name and enter transaction data</p>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">Transaction added successfully!</span>
        </div>
      )}

      {/* Transaction Entry Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
            Add New Transaction
          </h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buyer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buyer Name *
                </label>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter buyer name"
                />
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type *
                </label>
                <select
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {transactionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Weight - Only for SALES */}
              {formData.transactionType === 'SALES' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter weight in kg"
                  />
                </div>
              )}

              {/* INR per kg - Only for SALES */}
              {formData.transactionType === 'SALES' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    INR per kg *
                  </label>
                  <input
                    type="number"
                    name="inrPerKg"
                    value={formData.inrPerKg}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="95.00"
                  />
                </div>
              )}

              {/* Auto Rent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Rent
                </label>
                <input
                  type="number"
                  name="autoRent"
                  value={formData.autoRent}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter auto rent amount"
                />
              </div>

              {/* Debit - Only for SALES */}
              {formData.transactionType === 'SALES' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Debit Amount (Auto-calculated)
                  </label>
                  <input
                    type="number"
                    name="debit"
                    value={formData.debit}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    placeholder="Auto-calculated"
                  />
                </div>
              )}

              {/* Credit - Only for RECEIPT */}
              {formData.transactionType === 'RECEIPT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Amount *
                  </label>
                  <input
                    type="number"
                    name="credit"
                    value={formData.credit}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter credit amount"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={clearForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      {transactionHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionHistory.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.buyerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.particulars}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.weight || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.debit || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.credit || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddBuyer
