import { useState, useEffect } from 'react'
import { 
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const BuyerData = () => {
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [buyers, setBuyers] = useState([])
  const [buyerTransactions, setBuyerTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfGenerating, setPdfGenerating] = useState(false)

  // Your actual Google Apps Script URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx89vJ41DN0_1u-qxngjETha-YUu3oWddvgi9aF74uyFBnRuYIu7hTj6e5VS7jTMHwa/exec'

  // Test Google Apps Script connection first
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Google Apps Script connection...')
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=buyers`)
        const data = await response.text()
        console.log('Raw response:', data)
        
        // Try to parse as JSON
        try {
          const jsonData = JSON.parse(data)
          console.log('Parsed JSON:', jsonData)
        } catch (parseError) {
          console.log('Response is not JSON, might be HTML or other format')
        }
      } catch (error) {
        console.error('Connection test failed:', error)
      }
    }
    
    testConnection()
  }, [])

  // Fetch buyers from Google Sheets using JSONP
  useEffect(() => {
    const fetchBuyers = () => {
      try {
        setLoading(true)
        console.log('Fetching from Google Sheets using JSONP')
        
        // Create a unique callback function name
        const callbackName = `handleBuyersData_${Date.now()}`
        
        // Create script tag for JSONP
        const script = document.createElement('script')
        script.src = `${GOOGLE_SCRIPT_URL}?action=buyers&callback=${callbackName}`
        
        script.onerror = async () => {
          console.error('JSONP fetch failed, trying regular fetch')
          
          // Try regular fetch as fallback
          try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=buyers`)
            const data = await response.json()
            console.log('Regular fetch successful:', data)
            console.log('Regular fetch data type:', typeof data)
            console.log('Regular fetch data length:', data?.length)
            console.log('Regular fetch data error:', data?.error)
            
            if (data && !data.error && data.length > 0) {
              console.log('Setting buyers data from regular fetch:', data)
              setBuyers(data)
            } else {
              console.log('Regular fetch: No valid data received')
              console.log('Regular fetch reason: data=', data, 'error=', data?.error, 'length=', data?.length)
              throw new Error('No valid data received')
            }
          } catch (fetchError) {
            console.error('Regular fetch also failed:', fetchError)
            setError('Failed to connect to Google Sheets')
            
            // No fallback data - show empty state
            setBuyers([])
          }
          setLoading(false)
          document.head.removeChild(script)
        }
        
        // Global callback function
        window[callbackName] = (data) => {
          console.log('Fetched data from Google Sheets:', data)
          console.log('Data type:', typeof data)
          console.log('Data length:', data?.length)
          console.log('Data error:', data?.error)
          
          if (data && !data.error && data.length > 0) {
            console.log('Setting buyers data:', data)
            setBuyers(data)
          } else {
            console.log('No data from Google Sheets, showing empty state')
            console.log('Reason: data=', data, 'error=', data?.error, 'length=', data?.length)
            // No fallback data - show empty state
            setBuyers([])
          }
          setLoading(false)
          document.head.removeChild(script)
          delete window[callbackName]
        }
        
        document.head.appendChild(script)
      } catch (err) {
        console.error('Error setting up JSONP:', err)
        setError(`Failed to connect to Google Sheets: ${err.message}`)
        setLoading(false)
      }
    }

    fetchBuyers()
  }, [])

  // Fetch transactions from Google Sheets using JSONP
  useEffect(() => {
    if (selectedBuyer) {
      const fetchTransactions = () => {
        try {
          setLoading(true)
          console.log('Fetching transactions for:', selectedBuyer.name)
          
          // Create a unique callback function name
          const callbackName = `handleTransactionsData_${Date.now()}`
          
          // Create script tag for JSONP
          const script = document.createElement('script')
          script.src = `${GOOGLE_SCRIPT_URL}?action=transactions&buyerName=${encodeURIComponent(selectedBuyer.name)}&callback=${callbackName}`
          
          script.onerror = async () => {
            console.error('JSONP fetch failed for transactions, trying regular fetch')
            
            // Try regular fetch as fallback
            try {
              const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=transactions&buyerName=${encodeURIComponent(selectedBuyer.name)}`)
              const data = await response.json()
              console.log('Regular fetch for transactions successful:', data)
              
              if (data && !data.error && data.length > 0) {
                setBuyerTransactions(data)
              } else {
                throw new Error('No valid transaction data received')
              }
            } catch (fetchError) {
              console.error('Regular fetch for transactions also failed, using fallback data:', fetchError)
              
              // No fallback data - show empty state
              setBuyerTransactions([])
            }
            setLoading(false)
            document.head.removeChild(script)
          }
          
          // Global callback function
          window[callbackName] = (data) => {
            console.log('Fetched transactions from Google Sheets:', data)
            if (data && !data.error && data.length > 0) {
              setBuyerTransactions(data)
            } else {
              console.log('No transaction data from Google Sheets, showing empty state')
              // No fallback data - show empty state
              setBuyerTransactions([])
            }
            setLoading(false)
            document.head.removeChild(script)
            delete window[callbackName]
          }
          
          document.head.appendChild(script)
        } catch (err) {
          console.error('Error setting up JSONP for transactions:', err)
          setError('Failed to fetch transactions from Google Sheets')
          setLoading(false)
        }
      }

      fetchTransactions()
    }
  }, [selectedBuyer])



  // Filter buyers based on search term
  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Generate PDF for buyer
  const generatePDF = async (buyer) => {
    setPdfGenerating(true)
    const doc = new jsPDF()
    
    // Company Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('RV PLASTICS', 105, 20, { align: 'center' })
    
    // Company Address (optional)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Buyer Transaction Report', 105, 30, { align: 'center' })
    
    // Buyer Information
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`Buyer: ${buyer.name}`, 20, 50)
    
    // Buyer Summary
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total Weight: ${buyer.totalweight || buyer.totalWeight} kg`, 20, 65)
    doc.text(`Total Debit: ₹${(buyer.totaldebit || buyer.totalDebit)?.toLocaleString()}`, 20, 75)
    doc.text(`Total Credit: ₹${(buyer.totalcredit || buyer.totalCredit)?.toLocaleString()}`, 20, 85)
    doc.text(`Balance: ₹${buyer.balance?.toLocaleString()}`, 20, 95)
    
    // Fetch transactions if not already loaded for this buyer
    let transactionsToUse = buyerTransactions
    if (!transactionsToUse || transactionsToUse.length === 0 || selectedBuyer?.name !== buyer.name) {
      try {
        console.log('Fetching transactions for PDF generation:', buyer.name)
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=transactions&buyerName=${encodeURIComponent(buyer.name)}`)
        const data = await response.json()
        if (data && !data.error && data.length > 0) {
          transactionsToUse = data
          console.log('Fetched transactions for PDF:', transactionsToUse)
        }
      } catch (error) {
        console.error('Error fetching transactions for PDF:', error)
        transactionsToUse = []
      }
    }
    
    // Transaction Table
    if (transactionsToUse && transactionsToUse.length > 0) {
      console.log('Transaction data for PDF:', transactionsToUse[0]) // Debug first transaction
      const tableData = transactionsToUse.map(transaction => [
        transaction.sno || '',
        transaction.date || '',
        transaction.particulars || '',
        transaction.weight || '',
        transaction.particulars === 'RECEIPT' ? '' : (transaction.inrkg || transaction.inrPerKg || transaction.inr_per_kg || '95'),
        transaction.autorent || transaction.autoRent || transaction.auto_rent || '',
        transaction.debit || '',
        transaction.credit || '',
        transaction.bal || transaction.balance || ''
      ])
      
      // Add total row
      const totalRow = [
        '',
        '',
        'TOTAL',
        `${transactionsToUse.reduce((sum, transaction) => sum + (parseFloat(transaction.weight) || 0), 0).toFixed(1)} kg`,
        '-',
        transactionsToUse.reduce((sum, transaction) => sum + (parseFloat(transaction.autorent || transaction.autoRent) || 0), 0).toFixed(1),
        `₹${transactionsToUse.reduce((sum, transaction) => sum + (parseFloat(transaction.debit) || 0), 0).toLocaleString()}`,
        `₹${transactionsToUse.reduce((sum, transaction) => sum + (parseFloat(transaction.credit) || 0), 0).toLocaleString()}`,
        `₹${buyer.balance?.toLocaleString()}`
      ]
      
      tableData.push(totalRow)
      
      autoTable(doc, {
        head: [['S.NO', 'DATE', 'PARTICULARS', 'WEIGHT', 'INR/kg', 'AUTO RENT', 'DEBIT', 'CREDIT', 'BAL']],
        body: tableData,
        startY: 110,
        styles: {
          fontSize: 7,
          cellPadding: 1,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          halign: 'left',
          valign: 'middle',
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 7,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1
        },
        bodyStyles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          fontSize: 7,
          cellPadding: 1,
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        },
        didDrawRow: (data) => {
          // Style the total row (last row)
          if (data.row.index === tableData.length - 1) {
            data.row.cells.forEach(cell => {
              cell.styles.fillColor = [173, 216, 230] // Light blue background
              cell.styles.fontStyle = 'bold'
              cell.styles.textColor = [0, 0, 0]
            })
          }
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 12 },
          1: { halign: 'center', cellWidth: 20 },
          2: { halign: 'left', cellWidth: 25 },
          3: { halign: 'right', cellWidth: 18 },
          4: { halign: 'right', cellWidth: 18 },
          5: { halign: 'right', cellWidth: 18 },
          6: { halign: 'right', cellWidth: 22 },
          7: { halign: 'right', cellWidth: 22 },
          8: { halign: 'right', cellWidth: 25 }
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.5,
        margin: { top: 110, left: 5, right: 5 },
        pageBreak: 'auto',
        rowPageBreak: 'avoid',
        showHead: 'everyPage'
      })
    } else {
      doc.setFontSize(12)
      doc.text('No transactions found for this buyer.', 20, 120)
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' })
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 285)
    }
    
    // Save the PDF
    doc.save(`${buyer.name.replace(/\s+/g, '_')}_Transaction_Report.pdf`)
    setPdfGenerating(false)
  }

  if (loading && buyers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading buyers...</div>
      </div>
    )
  }

  if (error && buyers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          <div>{error}</div>
          <div className="text-sm text-gray-500 mt-2">Check browser console for details</div>
        </div>
      </div>
    )
  }

  if (!loading && buyers.length === 0 && !error) {
    return (
      <div className="space-y-6 font-poppins">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Management</h1>
          <p className="text-gray-600 mt-2">View and manage all buyer information and transactions</p>
        </div>

        {/* Empty state */}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-gray-500 mb-2">No buyers found</div>
            <div className="text-sm text-gray-400">Connect to Google Sheets to view buyer data</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-poppins">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buyer Management</h1>
        <p className="text-gray-600 mt-2">View and manage all buyer information and transactions</p>
      </div>

      {/* Buyers Section */}
      <div className="space-y-6">
        {/* Search Bar - Only show when no buyer is selected */}
        {!selectedBuyer && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search buyers by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {filteredBuyers.length} buyer{filteredBuyers.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        )}

        {/* Buyers Grid - Only show when no buyer is selected */}
        {!selectedBuyer && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredBuyers.map((buyer) => (
              <div
                key={buyer.id}
                onClick={() => setSelectedBuyer(buyer)}
                className="group bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-200 hover:border-gray-300 hover:-translate-y-0.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                    <span className="text-blue-700 font-bold text-sm">{buyer.name.charAt(0)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">#{buyer.id}</div>
                  </div>
                </div>

                {/* Name */}
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 text-lg group-hover:text-gray-800 transition-colors duration-200 truncate">{buyer.name}</h3>
                </div>
                {/* Stats Grid - Compact */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-md p-2 group-hover:bg-gray-100 transition-colors duration-200">
                    <div className="text-xs text-gray-500 font-medium">Weight</div>
                    <div className="text-sm font-bold text-gray-900">{buyer.totalweight || buyer.totalWeight} kg</div>
                  </div>
                  <div className="bg-red-50 rounded-md p-2 group-hover:bg-red-100 transition-colors duration-200">
                    <div className="text-xs text-red-600 font-medium">Debit</div>
                    <div className="text-sm font-bold text-red-800">₹{(buyer.totaldebit || buyer.totalDebit)?.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-md p-2 group-hover:bg-green-100 transition-colors duration-200">
                    <div className="text-xs text-green-600 font-medium">Credit</div>
                    <div className="text-sm font-bold text-green-800">₹{(buyer.totalcredit || buyer.totalCredit)?.toLocaleString()}</div>
                  </div>
                  <div className="bg-blue-50 rounded-md p-2 group-hover:bg-blue-100 transition-colors duration-200">
                    <div className="text-xs text-blue-600 font-medium">Balance</div>
                    <div className="text-sm font-bold text-blue-800">₹{buyer.balance?.toLocaleString()}</div>
                  </div>
                </div>

                {/* Footer - Compact */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">View Details</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        generatePDF(buyer)
                      }}
                      disabled={pdfGenerating}
                      className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={pdfGenerating ? "Generating PDF..." : "Download PDF"}
                    >
                      {pdfGenerating ? (
                        <svg className="w-3 h-3 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <ArrowDownTrayIcon className="w-3 h-3 text-blue-600" />
                      )}
                    </button>
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                      <svg className="w-2.5 h-2.5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Buyer Details */}
        {selectedBuyer && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedBuyer(null)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Buyers
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Transaction Details - {selectedBuyer.name}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => generatePDF(selectedBuyer)}
                    disabled={pdfGenerating}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={pdfGenerating ? "Generating PDF..." : "Download PDF Report"}
                  >
                    {pdfGenerating ? (
                      <>
                        <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                        Download PDF
                      </>
                    )}
                  </button>
                <button
                  onClick={() => setSelectedBuyer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-blue-600 font-medium">Total Weight</div>
                  <div className="text-lg font-bold text-blue-800">{selectedBuyer.totalweight || selectedBuyer.totalWeight} kg</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-green-600 font-medium">Total Debit</div>
                  <div className="text-lg font-bold text-green-800">₹{(selectedBuyer.totaldebit || selectedBuyer.totalDebit)?.toLocaleString()}</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-yellow-600 font-medium">Total Credit</div>
                  <div className="text-lg font-bold text-yellow-800">₹{(selectedBuyer.totalcredit || selectedBuyer.totalCredit)?.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-purple-600 font-medium">Balance</div>
                  <div className="text-lg font-bold text-purple-800">₹{selectedBuyer.balance?.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
             {/* Transaction Table - Ledger Style */}
             <div className="overflow-x-auto">
               <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                <h3 className="text-2xl font-normal uppercase  text-gray-800 text-center"> {selectedBuyer.name}</h3>
               </div>
               <table className="min-w-full border border-gray-300">
                 <thead className="bg-gray-200">
                   <tr>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">S.NO</th>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">DATE</th>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">PARTICULARS</th>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">WEIGHT</th>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">INR / kg</th>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">AUTO RENT</th>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">DEBIT</th>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">CREDIT</th>
                     <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 border border-gray-300">BAL</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white">
                  {buyerTransactions.map((transaction, index) => (
                     <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                      <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-center">{transaction.sno || index + 1}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">{transaction.date}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 font-medium">{transaction.particulars}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right">{transaction.weight || ''}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right">{transaction.particulars === 'RECEIPT' ? '' : (transaction.inrkg || transaction.inrPerKg || transaction.inr_per_kg || '95')}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right">{transaction.autorent || transaction.autoRent || ''}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right font-medium">{transaction.debit || ''}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right font-medium">{transaction.credit || ''}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right font-bold">{transaction.bal || transaction.balance}</td>
                     </tr>
                   )) || (
                     <tr>
                       <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500 border border-gray-300">
                          {loading ? 'Loading transactions...' : 'No transactions found for this buyer'}
                       </td>
                     </tr>
                   )}
                   
                   {/* Total Row */}
                   {buyerTransactions && buyerTransactions.length > 0 && (
                     <tr className="bg-blue-100 border-t-2 border-blue-300">
                       <td className="px-3 py-2 text-sm font-bold text-gray-900 border border-gray-300 text-center" colSpan="3">TOTAL</td>
                       <td className="px-3 py-2 text-sm font-bold text-gray-900 border border-gray-300 text-right">
                         {buyerTransactions.reduce((sum, transaction) => sum + (parseFloat(transaction.weight) || 0), 0).toFixed(1)} kg
                       </td>
                       <td className="px-3 py-2 text-sm font-bold text-gray-900 border border-gray-300 text-right">-</td>
                       <td className="px-3 py-2 text-sm font-bold text-gray-900 border border-gray-300 text-right">
                         {buyerTransactions.reduce((sum, transaction) => sum + (parseFloat(transaction.autorent || transaction.autoRent) || 0), 0).toFixed(1)}
                       </td>
                       <td className="px-3 py-2 text-sm font-bold text-gray-900 border border-gray-300 text-right">
                         ₹{buyerTransactions.reduce((sum, transaction) => sum + (parseFloat(transaction.debit) || 0), 0).toLocaleString()}
                       </td>
                       <td className="px-3 py-2 text-sm font-bold text-gray-900 border border-gray-300 text-right">
                         ₹{buyerTransactions.reduce((sum, transaction) => sum + (parseFloat(transaction.credit) || 0), 0).toLocaleString()}
                       </td>
                       <td className="px-3 py-2 text-sm font-bold text-blue-800 border border-gray-300 text-right">
                         ₹{selectedBuyer.balance?.toLocaleString()}
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyerData
