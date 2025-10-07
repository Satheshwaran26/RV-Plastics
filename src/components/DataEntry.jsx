import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

const DataEntry = () => {
  const [formData, setFormData] = useState({
    buyerName: '',
    transactionType: 'SALES',
    date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format for input
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
    date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format for input
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [buyers, setBuyers] = useState([])

  // Google Apps Script URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx89vJ41DN0_1u-qxngjETha-YUu3oWddvgi9aF74uyFBnRuYIu7hTj6e5VS7jTMHwa/exec'

  // Fetch buyers from Google Sheets
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=buyers`)
        const data = await response.json()
        
        if (data && !data.error && data.length > 0) {
          setBuyers(data)
          console.log('Fetched buyers from Google Sheets:', data)
        } else {
          console.log('No buyers found in Google Sheets')
          setBuyers([])
        }
      } catch (error) {
        console.error('Error fetching buyers:', error)
        setError('Failed to fetch buyers from Google Sheets')
        setBuyers([])
      } finally {
        setLoading(false)
      }
    }

    fetchBuyers()
  }, [])
  
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
  
  // Get buyer names from Google Sheets data
  const buyerNames = buyers.map(buyer => buyer.name)

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
        const selectedBuyer = buyers.find(buyer => buyer.name === value)
        if (selectedBuyer) {
          // Use balance as due amount (positive balance means buyer owes money)
          const dueAmount = Math.max(0, selectedBuyer.balance || 0)
          newData.dueAmount = Number(dueAmount).toFixed(2)
          // Auto-calculate paid amount based on current payment type
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Calculate the next serial number (this would ideally come from the sheet)
      const nextSno = transactionHistory.length + 1
      
      // Calculate balance (this is a simplified calculation)
      const currentBalance = 0 // In a real app, you'd get this from the sheet
      const newBalance = currentBalance + (parseFloat(formData.debit) || 0) - (parseFloat(formData.credit) || 0)
      
      const transaction = {
        sno: nextSno,
        date: new Date(formData.date).toLocaleDateString('en-GB'), // Convert to DD/MM/YYYY format
        particulars: formData.transactionType,
        weight: formData.transactionType === 'SALES' ? formData.weight : '',
        inrkg: formData.transactionType === 'SALES' ? formData.inrPerKg : '',
        autorent: formData.autoRent || '',
        debit: formData.transactionType === 'SALES' ? formData.debit : '',
        credit: formData.transactionType === 'RECEIPT' ? formData.credit : '',
        bal: newBalance
      }
      
      // Send to Google Sheets using JSONP to avoid CORS issues
      const result = await new Promise((resolve, reject) => {
        const callbackName = `handleTransactionResult_${Date.now()}`
        
        // Create the transaction data as URL parameters
        const params = new URLSearchParams({
          action: 'addTransaction',
          buyerName: formData.buyerName,
          callback: callbackName,
          ...transaction
        })
        
        // Create script tag for JSONP
        const script = document.createElement('script')
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`
        
        script.onerror = () => {
          reject(new Error('Failed to add transaction'))
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
        console.log('Transaction added to Google Sheets:', result)
        
        // Add to local history for immediate display
        setTransactionHistory(prev => [...prev, {
          id: Date.now(),
          ...transaction
        }])
        
        setShowSuccess(true)
        setFormData({
          buyerName: '',
          transactionType: 'SALES',
          date: new Date().toLocaleDateString('en-CA'),
          weight: '',
          inrPerKg: '95',
          autoRent: '',
          debit: '',
          credit: '',
          particulars: 'SALES'
        })
        
        // Refresh buyers data to get updated totals
        const buyersResponse = await fetch(`${GOOGLE_SCRIPT_URL}?action=buyers`)
        const buyersData = await buyersResponse.json()
        if (buyersData && !buyersData.error) {
          setBuyers(buyersData)
        }
        
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        throw new Error(result.error || 'Failed to add transaction')
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      setError(`Failed to add transaction: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      const dueAmount = parseFloat(paymentData.dueAmount) || 0
      const paidAmount = parseFloat(paymentData.paidAmount) || 0
      const remainingAmount = dueAmount - paidAmount
      
      // Create a RECEIPT transaction for the payment
      const paymentTransaction = {
        sno: transactionHistory.length + 1,
        date: new Date(paymentData.date).toLocaleDateString('en-GB'), // Convert to DD/MM/YYYY format
        particulars: 'RECEIPT',
        weight: '',
        inrkg: '',
        autorent: '',
        debit: '',
        credit: paidAmount.toString(),
        bal: 0 // This will be calculated by the Google Apps Script
      }
      
      // Send payment as a RECEIPT transaction to Google Sheets using JSONP
      const result = await new Promise((resolve, reject) => {
        const callbackName = `handlePaymentResult_${Date.now()}`
        
        // Create the payment transaction data as URL parameters
        const params = new URLSearchParams({
          action: 'addTransaction',
          buyerName: paymentData.buyerName,
          callback: callbackName,
          ...paymentTransaction
        })
        
        // Create script tag for JSONP
        const script = document.createElement('script')
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`
        
        script.onerror = () => {
          reject(new Error('Failed to record payment'))
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
        console.log('Payment recorded in Google Sheets:', result)
        
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
        
        // Refresh buyers data to get updated totals
        const buyersResponse = await fetch(`${GOOGLE_SCRIPT_URL}?action=buyers`)
        const buyersData = await buyersResponse.json()
        if (buyersData && !buyersData.error) {
          setBuyers(buyersData)
        }
        
        setPaymentData({
          buyerName: '',
          paymentType: 'full',
          date: new Date().toLocaleDateString('en-CA'),
          dueAmount: '',
          paidAmount: '',
          paymentMethod: 'cash',
          notes: ''
        })
        setTimeout(() => setShowPaymentSuccess(false), 3000)
      } else {
        throw new Error(result.error || 'Failed to record payment')
      }
    } catch (error) {
      console.error('Error recording payment:', error)
      setError(`Failed to record payment: ${error.message}`)
    } finally {
      setLoading(false)
    }
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

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <XMarkIcon className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800 font-medium">{error}</span>
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

              {/* Transaction Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Date *
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
                  date: new Date().toLocaleDateString('en-CA'),
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
                    Add Transaction
                  </>
                )}
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
                    const selectedBuyer = buyers.find(buyer => buyer.name === paymentData.buyerName)
                    if (selectedBuyer) {
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 font-medium">Total Debit:</span>
                            <span className="ml-2 text-blue-900">₹{(selectedBuyer.totaldebit || selectedBuyer.totalDebit || 0).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Total Credit:</span>
                            <span className="ml-2 text-green-600">₹{(selectedBuyer.totalcredit || selectedBuyer.totalCredit || 0).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Balance:</span>
                            <span className={`ml-2 font-bold ${
                              selectedBuyer.balance === 0 ? 'text-green-600' : 
                              selectedBuyer.balance > 0 ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              ₹{(selectedBuyer.balance || 0).toLocaleString()}
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

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={paymentData.date}
                  onChange={handlePaymentInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  date: new Date().toLocaleDateString('en-CA'),
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
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Recording...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Record Payment
                  </>
                )}
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
