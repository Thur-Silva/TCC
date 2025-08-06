// app/(api)/(ride)/route+api.ts
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
      ORDER BY created_at DESC
    `

    console.log('Database query result:', result)

    // Sempre retorna um array, mesmo que vazio
    if (!result || result.length === 0) {
      console.log("Nenhuma ride encontrada na base de dados")
      return Response.json([], { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return Response.json(result, { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Database error:', error)
    return Response.json(
      { error: 'Erro interno do servidor ao buscar caronas' }, 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}