require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL and Key must be defined in .env.local');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const generateDemoData = async () => {
  const names = ['山田太郎', '鈴木花子', '佐藤健太', '高橋美咲', '伊藤直人'];
  const emails = ['test1@example.com', 'test2@example.com', 'test3@example.com', 'test4@example.com', 'test5@example.com'];
  const phones = ['090-1111-2222', '090-3333-4444', '090-5555-6666', '090-7777-8888', '090-9999-0000'];

  const startDate = new Date('2015-01-01');
  const endDate = new Date('2015-01-31');
  const businessHours = { start: 9, end: 18 };

  for (let i = 0; i < 10; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const randomHour = businessHours.start + Math.floor(Math.random() * (businessHours.end - businessHours.start));
    randomDate.setHours(randomHour, 0, 0, 0);

    const bookingData = {
      name: names[Math.floor(Math.random() * names.length)],
      email: emails[Math.floor(Math.random() * emails.length)],
      phone: phones[Math.floor(Math.random() * phones.length)],
      date: randomDate.toISOString().replace('T', ' ').split('.')[0],
      orderDate: new Date().toISOString().split('T')[0],
      orderNumber: `TEST-${Math.floor(1000 + Math.random() * 9000)}`
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();

    if (error) {
      console.error('Error inserting demo data:', error);
    } else {
      console.log('Inserted booking:', data[0]);
    }
  }
};

generateDemoData().catch(console.error);
