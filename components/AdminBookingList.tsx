'use client'

import { useState, useEffect } from 'react'
import { Booking } from '@/lib/types'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { ja }
})

interface CalendarEvent {
  title: string
  start: Date
  end: Date
  allDay: boolean
}

interface AdminBookingListProps {
  bookings: Booking[]
}

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV')
  }

  const goToNext = () => {
    toolbar.onNavigate('NEXT')
  }

  const goToToday = () => {
    const now = new Date()
    toolbar.date.setMonth(now.getMonth())
    toolbar.date.setYear(now.getFullYear())
    toolbar.date.setDate(now.getDate())
    toolbar.onNavigate('TODAY')
  }

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={goToBack}>
          前
        </button>
        <button type="button" onClick={goToToday}>
          今日
        </button>
        <button type="button" onClick={goToNext}>
          次
        </button>
      </span>
      <span className="rbc-btn-group">
        <button
          type="button"
          className={toolbar.view === 'month' ? 'rbc-active' : ''}
          onClick={() => toolbar.onView('month')}
        >
          月
        </button>
        <button
          type="button"
          className={toolbar.view === 'week' ? 'rbc-active' : ''}
          onClick={() => toolbar.onView('week')}
        >
          週
        </button>
        <button
          type="button"
          className={toolbar.view === 'day' ? 'rbc-active' : ''}
          onClick={() => toolbar.onView('day')}
        >
          日
        </button>
      </span>
    </div>
  )
}

export default function AdminBookingList({ bookings }: AdminBookingListProps) {
  const [displayView, setDisplayView] = useState<'table' | 'calendar'>('table')
  const [calendarView, setCalendarView] = useState<View>('week')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    if (!bookings) {
      setEvents([])
      return
    }
    
    const formattedEvents = bookings.map(booking => ({
      title: `${booking.name} - ${booking.phone}`,
      start: new Date(booking.date),
      end: new Date(new Date(booking.date).getTime() + 60 * 60 * 1000),
      allDay: false
    }))
    setEvents(formattedEvents)
  }, [bookings])

  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={() => setDisplayView('table')}
          className={`mr-2 px-4 py-2 rounded ${
            displayView === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          テーブル表示
        </button>
        <button
          onClick={() => setDisplayView('calendar')}
          className={`px-4 py-2 rounded ${
            displayView === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          カレンダー表示
        </button>
      </div>

      {displayView === 'table' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名前
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メール
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  電話番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  予約日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注文日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注文番号
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(bookings || []).map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.order_number}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[800px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={calendarView}
            onView={setCalendarView}
            date={date}
            onNavigate={setDate}
            views={['day', 'week', 'month']}
            messages={{
              today: '今日',
              previous: '前',
              next: '次',
              month: '月',
              week: '週',
              day: '日',
              agenda: '予定表',
              date: '日付',
              time: '時間',
              event: '予約',
              noEventsInRange: 'この期間の予約はありません。'
            }}
            components={{
              toolbar: CustomToolbar
            }}
            style={{ height: '100%' }}
          />
        </div>
      )}
    </div>
  )
}
