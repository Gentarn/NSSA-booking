'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import AdminCalendarView from './AdminCalendarView'

interface Booking {
  id: number
  name: string
  email: string
  phone: string
  date: string
  status: 'pending' | 'completed'
}

const AdminBookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
        const dummyData: Booking[] = [
          { id: 1, name: '山田太郎', email: 'yamada@example.com', phone: '090-1234-5678', date: '2025-02-01 10:00', status: 'pending' },
          { id: 2, name: '佐藤花子', email: 'sato@example.com', phone: '080-8765-4321', date: '2025-01-11 14:00', status: 'completed' },
          { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', phone: '070-2345-6789', date: '2025-01-20 11:00', status: 'pending' },
        ]
        setBookings(dummyData)
      } catch (err) {
        setError('予約データの取得中にエラーが発生しました。')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const toggleView = () => {
    setView(view === 'list' ? 'calendar' : 'list')
  }

  if (isLoading) {
    return <div className="text-center">データを読み込んでいます...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={toggleView}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {view === 'list' ? 'カレンダー表示' : 'リスト表示'}
        </button>
      </div>
      {view === 'list' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電話番号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予約日時</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'completed' ? '受取済み' : '未受取り'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <AdminCalendarView bookings={bookings} />
      )}
    </div>
  )
}

export default AdminBookingList

