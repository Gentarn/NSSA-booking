import AdminBookingList from '../../components/AdminBookingList'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">予約データ一覧</h1>
        <AdminBookingList />
      </div>
    </div>
  )
}

