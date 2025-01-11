'use client'

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { addDays, isWeekend, setHours, setMinutes } from 'date-fns'
import { ja } from 'date-fns/locale'
import { TimeSlot } from '../lib/types'
import "react-datepicker/dist/react-datepicker.css"

// Simulated function to get Japanese holidays
const getJapaneseHolidays = async () => {
  // In a real application, this would fetch from an API or database
  return [
    new Date(2023, 4, 3), // Constitution Day
    new Date(2023, 4, 4), // Greenery Day
    new Date(2023, 4, 5), // Children's Day
    // Add more holidays as needed
  ]
}

const BookingForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [holidays, setHolidays] = useState<Date[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isBookingComplete, setIsBookingComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    const fetchHolidays = async () => {
      const japaneseHolidays = await getJapaneseHolidays()
      setHolidays(japaneseHolidays)
    }
    fetchHolidays()

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    const orderNumberParam = urlParams.get('orderNumber')
    const orderDateParam = urlParams.get('orderDate')

    if (emailParam) setEmail(emailParam)
    if (orderNumberParam) setOrderNumber(orderNumberParam)
    if (orderDateParam) setOrderDate(orderDateParam)
  }, [])

  // 選択された日付が変更されたときに利用可能な時間枠を取得
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!selectedDate) return

      try {
        const response = await fetch(`/api/booking?date=${selectedDate.toISOString()}`)
        if (!response.ok) throw new Error('Failed to fetch available time slots')
        
        const data = await response.json()
        setAvailableTimeSlots(data.availableTimeSlots)
      } catch (err) {
        console.error('Error fetching available time slots:', err)
        setError('利用可能な時間枠の取得に失敗しました')
      }
    }

    fetchAvailableTimeSlots()
  }, [selectedDate])

  const isHoliday = (date: Date) => {
    return holidays.some(holiday => 
      holiday.getDate() === date.getDate() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getFullYear() === date.getFullYear()
    )
  }

  const filterAvailableDates = (date: Date) => {
    const currentDate = new Date()
    const fiveDaysFromNow = addDays(currentDate, 5)
    const oneMonthFromNow = addDays(currentDate, 30)
    return (
      date >= fiveDaysFromNow &&
      date <= oneMonthFromNow &&
      !isWeekend(date) &&
      !isHoliday(date)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!selectedDate) {
      setError('受け取り日時を選択してください')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: selectedDate.toISOString(),
          orderDate,
          orderNumber,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '予約処理中にエラーが発生しました')
      }

      alert('予約が確定されました！確認メールが送信されます。')
      setIsBookingComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '予約処理中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  if (isBookingComplete) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">予約ありがとうございました</h2>
        <p className="text-gray-600 mb-2">ご予約の詳細は、ご登録いただいたメールアドレスに送信されます。</p>
        <p className="text-gray-600">メールが届かない場合は、お手数ですがお問い合わせください。</p>
      </div>
    )
  }

  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12"

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">注文番号</label>
        <input
          type="text"
          id="orderNumber"
          value={orderNumber}
          readOnly
          className={`${inputClassName} bg-gray-100`}
        />
      </div>
      <div>
        <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">注文日</label>
        <input
          type="text"
          id="orderDate"
          value={orderDate}
          readOnly
          className={`${inputClassName} bg-gray-100`}
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">お名前 <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス <span className="text-red-500">*</span></label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">電話番号 <span className="text-red-500">*</span></label>
        <input
          type="tel"
          id="phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClassName}
        />
      </div>
      <div className="relative">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">受け取り日時 <span className="text-red-500">*</span></label>
        <div className="mt-1">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            timeCaption="時間"
            dateFormat="yyyy年MM月dd日 HH:mm"
            minDate={addDays(new Date(), 5)}
            maxDate={addDays(new Date(), 30)}
            filterDate={filterAvailableDates}
            minTime={setHours(setMinutes(new Date(), 0), 9)}
            maxTime={setHours(setMinutes(new Date(), 0), 17)}
            locale={ja}
            className={inputClassName}
            excludeTimes={
              availableTimeSlots.length > 0
                ? Array.from({ length: 9 }, (_, i) => i + 9)
                  .filter(hour => !availableTimeSlots.some(slot => slot.hour === hour))
                  .map(hour => setHours(setMinutes(new Date(), 0), hour))
                : []
            }
            placeholderText="日時を選択してください"
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-2/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? '処理中...' : '予約を確定する'}
        </button>
      </div>
    </form>
  )
}

export default BookingForm
