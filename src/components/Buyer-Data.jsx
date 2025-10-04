import { useState } from 'react'
import { 
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const BuyerData = () => {
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const buyers = [
    { id: 1, name: 'Rajesh Kumar', totalWeight: 420.3, totalDebit: 39952.5, totalCredit: 59213, balance: 28006.5 },
    { id: 2, name: 'Priya Sharma', totalWeight: 447.5, totalDebit: 42512.5, totalCredit: 35000, balance: 7512.5 },
    { id: 3, name: 'Amit Patel', totalWeight: 591.4, totalDebit: 56163, totalCredit: 43000, balance: 13163 },
    { id: 4, name: 'Sunita Singh', totalWeight: 324.6, totalDebit: 30837, totalCredit: 0, balance: 65512 },
    { id: 5, name: 'Vikram Gupta', totalWeight: 360.2, totalDebit: 34219, totalCredit: 0, balance: 82735.5 },
    { id: 6, name: 'Neha Agarwal', totalWeight: 233.5, totalDebit: 22182, totalCredit: 0, balance: 90022 },
    { id: 7, name: 'Ravi Verma', totalWeight: 232.9, totalDebit: 22125.5, totalCredit: 0, balance: 97261 },
    { id: 8, name: 'Kavita Joshi', totalWeight: 309.9, totalDebit: 29440.5, totalCredit: 0, balance: 117325 },
    { id: 9, name: 'Suresh Reddy', totalWeight: 291.6, totalDebit: 27702, totalCredit: 0, balance: 124953.5 },
    { id: 10, name: 'Anita Desai', totalWeight: 356.3, totalDebit: 33848.5, totalCredit: 0, balance: 146005.5 },
    { id: 11, name: 'Manoj Tiwari', totalWeight: 357.0, totalDebit: 33915, totalCredit: 0, balance: 156750 },
    { id: 12, name: 'Deepa Iyer', totalWeight: 269.4, totalDebit: 25592, totalCredit: 0, balance: 166449.5 },
    { id: 13, name: 'Rohit Nair', totalWeight: 324.3, totalDebit: 30808.5, totalCredit: 0, balance: 178058.5 },
    { id: 14, name: 'Shilpa Rao', totalWeight: 306.2, totalDebit: 29089, totalCredit: 0, balance: 193296.5 },
    { id: 15, name: 'Arjun Mehta', totalWeight: 311.7, totalDebit: 29611.5, totalCredit: 0, balance: 202863 },
    { id: 16, name: 'Pooja Shah', totalWeight: 336.3, totalDebit: 31948.5, totalCredit: 0, balance: 218861 },
    { id: 17, name: 'Kiran Malhotra', totalWeight: 200.2, totalDebit: 19019, totalCredit: 0, balance: 225083.5 },
    { id: 18, name: 'Nitin Chopra', totalWeight: 310.4, totalDebit: 29488, totalCredit: 0, balance: 243855.5 },
    { id: 19, name: 'Rekha Jain', totalWeight: 222.2, totalDebit: 21109, totalCredit: 0, balance: 251161 },
    { id: 20, name: 'Gaurav Saxena', totalWeight: 366.1, totalDebit: 34779.5, totalCredit: 0, balance: 276583 }
  ]

  const buyerTransactions = {
    1: [
      { date: '11.01.2025', particulars: 'SALES', weight: 108.2, inrPerKg: 95, autoRent: '', debit: 10279, credit: '', balance: 10279 },
      { date: '24.01.2025', particulars: 'RECEIPT', weight: '', inrPerKg: '', autoRent: '', debit: '', credit: 16213, balance: 9978.5 },
      { date: '15.01.2025', particulars: 'SALES', weight: 75.5, inrPerKg: 95, autoRent: '', debit: 7162.5, credit: '', balance: 17141 },
      { date: '05.02.2025', particulars: 'RECEIPT', weight: '', inrPerKg: '', autoRent: '', debit: '', credit: 28000, balance: 10934.5 },
      { date: '20.01.2025', particulars: 'SALES', weight: 92.3, inrPerKg: 95, autoRent: '', debit: 8768.5, credit: '', balance: 19703 },
      { date: '12.02.2025', particulars: 'SALES', weight: 88.6, inrPerKg: 95, autoRent: '', debit: 8417, credit: '', balance: 28120 },
      { date: '18.02.2025', particulars: 'RECEIPT', weight: '', inrPerKg: '', autoRent: '', debit: '', credit: 15000, balance: 13120 },
      { date: '25.02.2025', particulars: 'SALES', weight: 156.7, inrPerKg: 95, autoRent: '', debit: 14886.5, credit: '', balance: 28006.5 }
    ],
    2: [
      { date: '24.01.2025', particulars: 'SALES', weight: 167.5, inrPerKg: 95, autoRent: '', debit: 15912.5, credit: '', balance: 15912.5 },
      { date: '28.01.2025', particulars: 'SALES', weight: 134.2, inrPerKg: 95, autoRent: '', debit: 12749, credit: '', balance: 28661.5 },
      { date: '15.02.2025', particulars: 'RECEIPT', weight: '', inrPerKg: '', autoRent: '', debit: '', credit: 20000, balance: 8661.5 },
      { date: '20.02.2025', particulars: 'SALES', weight: 145.8, inrPerKg: 95, autoRent: '', debit: 13851, credit: '', balance: 22512.5 },
      { date: '25.02.2025', particulars: 'RECEIPT', weight: '', inrPerKg: '', autoRent: '', debit: '', credit: 15000, balance: 7512.5 }
    ],
    3: [
      { date: '15.01.2025', particulars: 'SALES', weight: 89.3, inrPerKg: 95, autoRent: '', debit: 8483.5, credit: '', balance: 8483.5 },
      { date: '18.01.2025', particulars: 'SALES', weight: 112.7, inrPerKg: 95, autoRent: '', debit: 10706.5, credit: '', balance: 19190 },
      { date: '25.01.2025', particulars: 'SALES', weight: 98.4, inrPerKg: 95, autoRent: '', debit: 9348, credit: '', balance: 28538 },
      { date: '30.01.2025', particulars: 'RECEIPT', weight: '', inrPerKg: '', autoRent: '', debit: '', credit: 25000, balance: 3538 },
      { date: '05.02.2025', particulars: 'SALES', weight: 156.2, inrPerKg: 95, autoRent: '', debit: 14839, credit: '', balance: 18377 },
      { date: '10.02.2025', particulars: 'RECEIPT', weight: '', inrPerKg: '', autoRent: '', debit: '', credit: 18000, balance: 377 },
      { date: '15.02.2025', particulars: 'SALES', weight: 134.8, inrPerKg: 95, autoRent: '', debit: 12786, credit: '', balance: 13163 }
    ],
    4: [
      { date: '18.01.2025', particulars: 'SALES', weight: 145.7, inrPerKg: 95, autoRent: '', debit: 13841.5, credit: '', balance: 48516.5 },
      { date: '22.01.2025', particulars: 'SALES', weight: 178.9, inrPerKg: 95, autoRent: '', debit: 16995.5, credit: '', balance: 65512 }
    ],
    5: [
      { date: '22.01.2025', particulars: 'SALES', weight: 203.4, inrPerKg: 95, autoRent: '', debit: 19323, credit: '', balance: 67839.5 },
      { date: '26.01.2025', particulars: 'SALES', weight: 156.8, inrPerKg: 95, autoRent: '', debit: 14896, credit: '', balance: 82735.5 }
    ],
    6: [
      { date: '12.01.2025', particulars: 'SALES', weight: 76.8, inrPerKg: 95, autoRent: '', debit: 7296, credit: '', balance: 75135.5 },
      { date: '16.01.2025', particulars: 'SALES', weight: 89.2, inrPerKg: 95, autoRent: '', debit: 8474, credit: '', balance: 83609.5 },
      { date: '23.01.2025', particulars: 'SALES', weight: 67.5, inrPerKg: 95, autoRent: '', debit: 6412.5, credit: '', balance: 90022 }
    ],
    7: [
      { date: '14.01.2025', particulars: 'SALES', weight: 134.2, inrPerKg: 95, autoRent: '', debit: 12749, credit: '', balance: 87884.5 },
      { date: '19.01.2025', particulars: 'SALES', weight: 98.7, inrPerKg: 95, autoRent: '', debit: 9376.5, credit: '', balance: 97261 }
    ],
    8: [
      { date: '13.01.2025', particulars: 'SALES', weight: 98.6, inrPerKg: 95, autoRent: '', debit: 9367, credit: '', balance: 97251.5 },
      { date: '17.01.2025', particulars: 'SALES', weight: 123.4, inrPerKg: 95, autoRent: '', debit: 11723, credit: '', balance: 108974.5 },
      { date: '21.01.2025', particulars: 'SALES', weight: 87.9, inrPerKg: 95, autoRent: '', debit: 8350.5, credit: '', balance: 117325 }
    ],
    9: [
      { date: '16.01.2025', particulars: 'SALES', weight: 156.9, inrPerKg: 95, autoRent: '', debit: 14905.5, credit: '', balance: 112157 },
      { date: '20.01.2025', particulars: 'SALES', weight: 134.7, inrPerKg: 95, autoRent: '', debit: 12796.5, credit: '', balance: 124953.5 }
    ],
    10: [
      { date: '17.01.2025', particulars: 'SALES', weight: 112.4, inrPerKg: 95, autoRent: '', debit: 10678, credit: '', balance: 122835 },
      { date: '24.01.2025', particulars: 'SALES', weight: 145.6, inrPerKg: 95, autoRent: '', debit: 13832, credit: '', balance: 136667 },
      { date: '29.01.2025', particulars: 'SALES', weight: 98.3, inrPerKg: 95, autoRent: '', debit: 9338.5, credit: '', balance: 146005.5 }
    ],
    11: [
      { date: '19.01.2025', particulars: 'SALES', weight: 189.7, inrPerKg: 95, autoRent: '', debit: 18021.5, credit: '', balance: 140856.5 },
      { date: '25.01.2025', particulars: 'SALES', weight: 167.3, inrPerKg: 95, autoRent: '', debit: 15893.5, credit: '', balance: 156750 }
    ],
    12: [
      { date: '18.01.2025', particulars: 'SALES', weight: 67.3, inrPerKg: 95, autoRent: '', debit: 6393.5, credit: '', balance: 147250 },
      { date: '22.01.2025', particulars: 'SALES', weight: 89.7, inrPerKg: 95, autoRent: '', debit: 8521.5, credit: '', balance: 155771.5 },
      { date: '27.01.2025', particulars: 'SALES', weight: 112.4, inrPerKg: 95, autoRent: '', debit: 10678, credit: '', balance: 166449.5 }
    ],
    13: [
      { date: '20.01.2025', particulars: 'SALES', weight: 178.5, inrPerKg: 95, autoRent: '', debit: 16957.5, credit: '', balance: 164207.5 },
      { date: '26.01.2025', particulars: 'SALES', weight: 145.8, inrPerKg: 95, autoRent: '', debit: 13851, credit: '', balance: 178058.5 }
    ],
    14: [
      { date: '21.01.2025', particulars: 'SALES', weight: 95.2, inrPerKg: 95, autoRent: '', debit: 9044, credit: '', balance: 173251.5 },
      { date: '25.01.2025', particulars: 'SALES', weight: 123.6, inrPerKg: 95, autoRent: '', debit: 11742, credit: '', balance: 184993.5 },
      { date: '30.01.2025', particulars: 'SALES', weight: 87.4, inrPerKg: 95, autoRent: '', debit: 8303, credit: '', balance: 193296.5 }
    ],
    15: [
      { date: '22.01.2025', particulars: 'SALES', weight: 143.8, inrPerKg: 95, autoRent: '', debit: 13661, credit: '', balance: 186912.5 },
      { date: '28.01.2025', particulars: 'SALES', weight: 167.9, inrPerKg: 95, autoRent: '', debit: 15950.5, credit: '', balance: 202863 }
    ],
    16: [
      { date: '23.01.2025', particulars: 'SALES', weight: 201.6, inrPerKg: 95, autoRent: '', debit: 19152, credit: '', balance: 206064.5 },
      { date: '27.01.2025', particulars: 'SALES', weight: 134.7, inrPerKg: 95, autoRent: '', debit: 12796.5, credit: '', balance: 218861 }
    ],
    17: [
      { date: '24.01.2025', particulars: 'SALES', weight: 87.4, inrPerKg: 95, autoRent: '', debit: 8303, credit: '', balance: 214367.5 },
      { date: '29.01.2025', particulars: 'SALES', weight: 112.8, inrPerKg: 95, autoRent: '', debit: 10716, credit: '', balance: 225083.5 }
    ],
    18: [
      { date: '25.01.2025', particulars: 'SALES', weight: 165.1, inrPerKg: 95, autoRent: '', debit: 15684.5, credit: '', balance: 230052 },
      { date: '30.01.2025', particulars: 'SALES', weight: 145.3, inrPerKg: 95, autoRent: '', debit: 13803.5, credit: '', balance: 243855.5 }
    ],
    19: [
      { date: '26.01.2025', particulars: 'SALES', weight: 123.7, inrPerKg: 95, autoRent: '', debit: 11751.5, credit: '', balance: 241803.5 },
      { date: '31.01.2025', particulars: 'SALES', weight: 98.5, inrPerKg: 95, autoRent: '', debit: 9357.5, credit: '', balance: 251161 }
    ],
    20: [
      { date: '27.01.2025', particulars: 'SALES', weight: 198.3, inrPerKg: 95, autoRent: '', debit: 18838.5, credit: '', balance: 260642 },
      { date: '01.02.2025', particulars: 'SALES', weight: 167.8, inrPerKg: 95, autoRent: '', debit: 15941, credit: '', balance: 276583 }
    ]
  }

  // Filter buyers based on search term
  const filteredBuyers = buyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                className="group bg-white border border-gray-200 rounded-xl p-4 md:p-6 cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:border-gray-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                    <span className="text-slate-700 font-bold text-lg">{buyer.name.charAt(0)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">ID #{buyer.id}</div>
                    <div className="text-xs text-gray-400">Buyer</div>
                  </div>
                </div>

                {/* Name */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-slate-800 transition-colors duration-200">{buyer.name}</h3>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3 group-hover:bg-slate-100 transition-colors duration-200">
                    <div className="text-xs text-gray-500 font-medium mb-1">Weight</div>
                    <div className="text-sm font-bold text-gray-900">{buyer.totalWeight} kg</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 group-hover:bg-red-100 transition-colors duration-200">
                    <div className="text-xs text-red-600 font-medium mb-1">Debit</div>
                    <div className="text-sm font-bold text-red-800">₹{buyer.totalDebit.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 group-hover:bg-green-100 transition-colors duration-200">
                    <div className="text-xs text-green-600 font-medium mb-1">Credit</div>
                    <div className="text-sm font-bold text-green-800">₹{buyer.totalCredit.toLocaleString()}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 group-hover:bg-blue-100 transition-colors duration-200">
                    <div className="text-xs text-blue-600 font-medium mb-1">Balance</div>
                    <div className="text-sm font-bold text-blue-800">₹{buyer.balance.toLocaleString()}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">View Details</span>
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                    <svg className="w-3 h-3 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
                <button
                  onClick={() => setSelectedBuyer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-blue-600 font-medium">Total Weight</div>
                  <div className="text-lg font-bold text-blue-800">{selectedBuyer.totalWeight} kg</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-green-600 font-medium">Total Debit</div>
                  <div className="text-lg font-bold text-green-800">₹{selectedBuyer.totalDebit.toLocaleString()}</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-yellow-600 font-medium">Total Credit</div>
                  <div className="text-lg font-bold text-yellow-800">₹{selectedBuyer.totalCredit.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-purple-600 font-medium">Balance</div>
                  <div className="text-lg font-bold text-purple-800">₹{selectedBuyer.balance.toLocaleString()}</div>
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
                   {buyerTransactions[selectedBuyer.id]?.map((transaction, index) => (
                     <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-center">{index + 1}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">{transaction.date}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 font-medium">{transaction.particulars}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right">{transaction.weight || ''}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right">{transaction.inrPerKg || ''}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right">{transaction.autoRent || ''}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right font-medium">{transaction.debit || ''}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right font-medium">{transaction.credit || ''}</td>
                       <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300 text-right font-bold">{transaction.balance}</td>
                     </tr>
                   )) || (
                     <tr>
                       <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500 border border-gray-300">
                         No transactions found for this buyer
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
