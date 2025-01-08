'use client'

import { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import BookingSummaryModal from './BookingSummaryModal'

moment.locale('ja')
const localizer = momentLocalizer(moment)

interface Booking {
  id: number
  name: string
  email: string
  phone: string
  date: string
  status: 'pending' | 'completed'
}

interface AdminCalendarViewProps {
  bookings: Booking[]
}

const AdminCalendarView: React.FC<AdminCalendarViewProps> = ({ bookings }) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const events = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.name} (${booking.status === 'completed' ? '受取済み' : '未受取り'})`,
    start: new Date(booking.date),
    end: new Date(new Date(booking.date).getTime() + 60 * 60 * 1000), // 1 hour duration
    status: booking.status,
    resource: booking
  }))

  const handleSelectEvent = (event: any) => {
    setSelectedBooking(event.resource)
  }

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.status === 'completed' ? '#10B981' : '#FBBF24',
          },
        })}
        onSelectEvent={handleSelectEvent}
      />
      {selectedBooking && (
        <BookingSummaryModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  )
}

export default AdminCalendarView

