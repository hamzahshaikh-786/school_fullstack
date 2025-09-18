import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Payments from './pages/Payments'
import TransactionDetail from './pages/TransactionDetail'
import SchoolTransactions from './pages/SchoolTransactions'
import CreatePayment from './pages/CreatePayment'

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="p-4 sm:p-6 lg:p-8">
              <Payments />
            </div>
          } />
          <Route path="/transaction/:custom_order_id" element={<TransactionDetail />} />
          <Route path="/school/:schoolId" element={<SchoolTransactions />} />
          <Route path="/create-payment" element={<CreatePayment />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
