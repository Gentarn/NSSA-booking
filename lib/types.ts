export interface Booking {
  id: string
  name: string
  email: string
  phone: string
  date: string
  order_date: string
  order_number: string
  status: 'confirmed' | 'cancelled' | 'pending'
}

export interface TimeSlot {
  hour: number
  time: string
}
