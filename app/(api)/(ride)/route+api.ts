// app/(api)/rides/route.ts
import { neon } from '@neondatabase/serverless'

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)
  try {
    const result = await sql`
      SELECT 
        ride_id, 
        driver_id, 
        origin_latitude, 
        origin_longitude, 
        destination_latitude, 
        destination_longitude,
        ride_time, 
        fare_price,
        origin_address,
        destination_address,
        payment_status,
        user_id,
        created_at
      FROM rides
    `
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Erro ao buscar rides' }, { status: 500 })
  }
}
