import supabase from '../../lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, phone, date, orderDate, orderNumber } = await request.json()

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name,
          email,
          phone,
          date,
          order_date: orderDate,
          order_number: orderNumber
        }
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
