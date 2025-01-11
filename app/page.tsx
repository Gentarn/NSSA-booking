'use client'

import BookingForm from '../components/BookingForm'
import "react-datepicker/dist/react-datepicker.css"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <h1 className="text-center text-3xl font-bold text-blue-600 mb-6">商品受け取り予約</h1>
            <BookingForm />
          </div>
        </div>
      </div>
    </main>
  )
}
