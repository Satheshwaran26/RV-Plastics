import { useState } from 'react'
import { 
  PlusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

const DataEntry = () => {
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
  
  const [paymentData, setPaymentData] = useState({
    buyerName: '',
    paymentType: 'full',
    dueAmount: '',
    paidAmount: '',
    paymentMethod: 'cash',
    notes: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [transactionHistory, setTransactionHistory] = useState([])
  const [paymentHistory, setPaymentHistory] = useState([])
  const [activeSection, setActiveSection] = useState('transaction') // 'transaction' or 'payment'
  
  // Sample buyer data with debit amounts and paid amounts
  const buyerData = [
    { name: 'Rajesh Kumar', totalDebit: 39952.5, totalPaid: 28000, remaining: 11952.5 },
    { name: 'Priya Sharma', totalDebit: 42512.5, totalPaid: 35000, remaining: 7512.5 },
    { name: 'Amit Patel', totalDebit: 56163, totalPaid: 43000, remaining: 13163 },
    { name: 'Sunita Singh', totalDebit: 30837, totalPaid: 0, remaining: 30837 },
    { name: 'Vikram Gupta', totalDebit: 34219, totalPaid: 0, remaining: 34219 },
    { name: 'Neha Agarwal', totalDebit: 22182, totalPaid: 0, remaining: 22182 },
    { name: 'Ravi Verma', totalDebit: 22125.5, totalPaid: 0, remaining: 22125.5 },
    { name: 'Kavita Joshi', totalDebit: 29440.5, totalPaid: 0, remaining: 29440.5 },
    { name: 'Suresh Reddy', totalDebit: 27702, totalPaid: 0, remaining: 27702 },
    { name: 'Anita Desai', totalDebit: 33848.5, totalPaid: 0, remaining: 33848.5 },
    { name: 'Manoj Tiwari', totalDebit: 33915, totalPaid: 0, remaining: 33915 },
    { name: 'Deepa Iyer', totalDebit: 25592, totalPaid: 0, remaining: 25592 },
    { name: 'Rohit Nair', totalDebit: 30808.5, totalPaid: 0, remaining: 30808.5 },
    { name: 'Shilpa Rao', totalDebit: 29089, totalPaid: 0, remaining: 29089 },
    { name: 'Arjun Mehta', totalDebit: 29611.5, totalPaid: 0, remaining: 29611.5 },
    { name: 'Pooja Shah', totalDebit: 31948.5, totalPaid: 0, remaining: 31948.5 },
    { name: 'Kiran Malhotra', totalDebit: 19019, totalPaid: 0, remaining: 19019 },
    { name: 'Nitin Chopra', totalDebit: 29488, totalPaid: 0, remaining: 29488 },
    { name: 'Rekha Jain', totalDebit: 21109, totalPaid: 0, remaining: 21109 },
    { name: 'Gaurav Saxena', totalDebit: 34779.5, totalPaid: 0, remaining: 34779.5 }
  ]

  const transactionTypes = ['SALES', 'RECEIPT']
  const paymentTypes = [
    { value: 'full', label: 'Full Payment' },
    { value: 'half', label: '50% Payment' },
    { value: 'quarter', label: '25% Payment' },
    { value: 'custom', label: 'Custom Amount' }
  ]
  const paymentMethods = ['cash', 'bank_transfer', 'cheque', 'upi', 'card']
  
  const buyerNames = [
    'Rajesh Kumar',
    'Priya Sharma', 
    'Amit Patel',
    'Sunita Singh',
    'Vikram Gupta',
    'Neha Agarwal',
    'Ravi Verma',
    'Kavita Joshi',
    'Suresh Reddy',
    'Anita Desai',
    'Manoj Tiwari',
    'Deepa Iyer',
    'Rohit Nair',
    'Shilpa Rao',
    'Arjun Mehta',
    'Pooja Shah',
    'Kiran Malhotra',
    'Nitin Chopra',
    'Rekha Jain',
    'Gaurav Saxena'
  ]

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

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target
    setPaymentData(prev => {
      const newData = {
        ...prev,
        [name]: value
      }
      
      // Auto-populate due amount when buyer is selected
      if (name === 'buyerName') {
        const selectedBuyer = buyerData.find(buyer => buyer.name === value)
        if (selectedBuyer) {
          newData.dueAmount = Number(selectedBuyer.remaining).toFixed(2)
          // Auto-calculate paid amount based on current payment type
          let paidAmount = 0
          switch (prev.paymentType) {
            case 'full':
              paidAmount = selectedBuyer.remaining
              break
            case 'half':
              paidAmount = selectedBuyer.remaining * 0.5
              break
            case 'quarter':
              paidAmount = selectedBuyer.remaining * 0.25
              break
            case 'custom':
              paidAmount = prev.paidAmount || 0
              break
            default:
              paidAmount = 0
          }
          newData.paidAmount = Number(paidAmount).toFixed(2)
        }
      }
      
      // Auto-calculate paid amount based on payment type
      if (name === 'paymentType' && prev.dueAmount) {
        const dueAmount = parseFloat(prev.dueAmount) || 0
        let paidAmount = 0
        
        switch (value) {
          case 'full':
            paidAmount = dueAmount
            break
          case 'half':
            paidAmount = dueAmount * 0.5
            break
          case 'quarter':
            paidAmount = dueAmount * 0.25
            break
          case 'custom':
            paidAmount = prev.paidAmount || 0
            break
          default:
            paidAmount = 0
        }
        
        newData.paidAmount = Number(paidAmount).toFixed(2)
      }
      
      // Auto-calculate paid amount when due amount changes
      if (name === 'dueAmount' && prev.paymentType !== 'custom') {
        const dueAmount = parseFloat(value) || 0
        let paidAmount = 0
        
        switch (prev.paymentType) {
          case 'full':
            paidAmount = dueAmount
            break
          case 'half':
            paidAmount = dueAmount * 0.5
            break
          case 'quarter':
            paidAmount = dueAmount * 0.25
            break
          default:
            paidAmount = 0
        }
        
        newData.paidAmount = Number(paidAmount).toFixed(2)
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

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    
    const dueAmount = parseFloat(paymentData.dueAmount) || 0
    const paidAmount = parseFloat(paymentData.paidAmount) || 0
    const remainingAmount = dueAmount - paidAmount
    
    const payment = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      buyerName: paymentData.buyerName,
      paymentType: paymentData.paymentType,
      dueAmount: dueAmount,
      paidAmount: paidAmount,
      remainingAmount: remainingAmount,
      paymentMethod: paymentData.paymentMethod,
      notes: paymentData.notes,
      status: remainingAmount === 0 ? 'Paid' : remainingAmount > 0 ? 'Partial' : 'Overpaid'
    }
    
    setPaymentHistory(prev => [...prev, payment])
    setShowPaymentSuccess(true)
    
    // Update buyer data (in a real app, this would update the database)
    // For now, we'll just show success message
    console.log(`Payment recorded for ${paymentData.buyerName}: ₹${paidAmount}`)
    
    setPaymentData({
      buyerName: '',
      paymentType: 'full',
      dueAmount: '',
      paidAmount: '',
      paymentMethod: 'cash',
      notes: ''
    })
    setTimeout(() => setShowPaymentSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Entry</h1>
        <p className="text-gray-600 mt-2">Add new transactions and manage payments for buyers</p>
      </div>

      {/* Toggle Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex">
          <button
            onClick={() => setActiveSection('transaction')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              activeSection === 'transaction'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Transaction Entry</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSection('payment')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              activeSection === 'payment'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>Payment Handling</span>
            </div>
          </button>
        </div>
      </div>

      {/* Success messages */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">Transaction added successfully!</span>
        </div>
      )}

      {showPaymentSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">Payment recorded successfully!</span>
        </div>
      )}

      {/* Transaction Entry Form */}
      {activeSection === 'transaction' && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add New Transaction</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Buyer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buyer Name *
                </label>
                <select
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select buyer name</option>
                  {buyerNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
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
                onClick={() => setFormData({
                  buyerName: '',
                  transactionType: 'SALES',
                  weight: '',
                  inrPerKg: '95',
                  autoRent: '',
                  debit: '',
                  credit: '',
                  particulars: 'SALES'
                })}
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
      )}

      {/* Payment Handling Section */}
      {activeSection === 'payment' && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment Handling</h2>
          <p className="text-sm text-gray-600 mt-1">Record partial or full payments from buyers</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            {/* Buyer Information Display */}
            {paymentData.buyerName && (
              <div className="col-span-full mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">Buyer Information</h3>
                  {(() => {
                    const selectedBuyer = buyerData.find(buyer => buyer.name === paymentData.buyerName)
                    if (selectedBuyer) {
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 font-medium">Total Debit:</span>
                            <span className="ml-2 text-blue-900">₹{selectedBuyer.totalDebit.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Already Paid:</span>
                            <span className="ml-2 text-green-600">₹{selectedBuyer.totalPaid.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Remaining:</span>
                            <span className={`ml-2 font-bold ${
                              selectedBuyer.remaining === 0 ? 'text-green-600' : 
                              selectedBuyer.remaining > 0 ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              ₹{selectedBuyer.remaining.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Buyer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buyer Name *
                </label>
                <select
                  name="buyerName"
                  value={paymentData.buyerName}
                  onChange={handlePaymentInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select buyer name</option>
                  {buyerNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type *
                </label>
                <select
                  name="paymentType"
                  value={paymentData.paymentType}
                  onChange={handlePaymentInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {paymentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Due Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Amount (₹) *
                </label>
                <input
                  type="number"
                  name="dueAmount"
                  value={paymentData.dueAmount}
                  onChange={handlePaymentInputChange}
                  required
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter total amount due"
                />
              </div>

              {/* Paid Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid Amount (₹) *
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  value={paymentData.paidAmount}
                  onChange={handlePaymentInputChange}
                  required
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Auto-calculated or enter custom amount"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  value={paymentData.notes}
                  onChange={handlePaymentInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Payment notes (optional)"
                />
              </div>
            </div>

            {/* Payment Summary */}
            {paymentData.dueAmount && paymentData.paidAmount && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Due Amount:</span>
                    <span className="ml-2 font-medium">₹{parseFloat(paymentData.dueAmount || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Paid Amount:</span>
                    <span className="ml-2 font-medium text-green-600">₹{parseFloat(paymentData.paidAmount || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span>
                    <span className={`ml-2 font-medium ${
                      (parseFloat(paymentData.dueAmount || 0) - parseFloat(paymentData.paidAmount || 0)) === 0 
                        ? 'text-green-600' 
                        : (parseFloat(paymentData.dueAmount || 0) - parseFloat(paymentData.paidAmount || 0)) > 0 
                          ? 'text-red-600' 
                          : 'text-blue-600'
                    }`}>
                      ₹{(parseFloat(paymentData.dueAmount || 0) - parseFloat(paymentData.paidAmount || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setPaymentData({
                  buyerName: '',
                  paymentType: 'full',
                  dueAmount: '',
                  paidAmount: '',
                  paymentMethod: 'cash',
                  notes: ''
                })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Record Payment
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* Transaction History */}
      {activeSection === 'transaction' && transactionHistory.length > 0 && (
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

      {/* Payment History */}
      {activeSection === 'payment' && paymentHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.buyerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{payment.paymentType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.dueAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{payment.paidAmount.toLocaleString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      payment.remainingAmount === 0 ? 'text-green-600' : 
                      payment.remainingAmount > 0 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      ₹{payment.remainingAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{payment.paymentMethod.replace('_', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
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

export default DataEntry
