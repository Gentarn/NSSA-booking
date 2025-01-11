import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { TimeSlot } from '../../../lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const { name, email, phone, date, orderDate, orderNumber } = await request.json()

    const { data, error } = await supabase
      .from('booking')
      .insert([
        {
          name,
          email,
          phone,
          date,
          order_date: orderDate,
          order_number: orderNumber,
          status: 'confirmed'
        }
      ])
      .select()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json(
        { 
          error: '予約の保存に失敗しました',
          details: error.message 
        },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: '予約データの作成に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { 
        error: '予期せぬエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: '日付が指定されていません' },
        { status: 400 }
      )
    }

    // 指定日付の予約データを取得
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('date')
      .eq('date', date)

    if (error) {
      console.error('Database query error:', error)
      return NextResponse.json(
        { 
          error: '予約データの取得に失敗しました',
          details: error.message 
        },
        { status: 500 }
      )
    }

    // 営業時間（9:00 - 18:00）の時間帯を生成
    const businessHours = {
      start: 9,
      end: 18
    }
    
    const allTimeSlots = Array.from(
      { length: businessHours.end - businessHours.start },
      (_, i) => ({
        hour: businessHours.start + i,
        time: `${businessHours.start + i}:00`
      })
    )

    // 予約済みの時間帯を除外
    const bookedTimes = booking
      .map(booking => new Date(booking.date).getHours())
      .filter(hour => hour >= businessHours.start && hour < businessHours.end)

    const availableTimeSlots = allTimeSlots.filter(
      slot => !bookedTimes.includes(slot.hour)
    )

    return NextResponse.json(
      { 
        availableTimeSlots,
        businessHours: {
          start: businessHours.start,
          end: businessHours.end
        }
      }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { 
        error: '予期せぬエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
