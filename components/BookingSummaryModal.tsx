import React from 'react'

interface Booking {
  id: number
  name: string
  email: string
  phone: string
  date: string
  status: 'pending' | 'completed'
}

interface BookingSummaryModalProps {
  booking: Booking
  onClose: () => void
}

const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">予約詳細</h2>
        <div className="mb-4">
          <p><strong>ID:</strong> {booking.id}</p>
          <p><strong>名前:</strong> {booking.name}</p>
          <p><strong>メールアドレス:</strong> {booking.email}</p>
          <p><strong>電話番号:</strong> {booking.phone}</p>
          <p><strong>予約日時:</strong> {booking.date}</p>
          <p><strong>ステータス:</strong> {booking.status === 'completed' ? '受取済み' : '未受取り'}</p>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}

export default BookingSummaryModal

