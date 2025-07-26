
// 📁 /app/(api)/(ride)/[id]+api.ts
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const rideId = params.id

  const result = await sql`SELECT * FROM rides WHERE id = ${rideId}`

  if (result.length === 0) {
    return Response.json({ error: "Ride not found" }, { status: 404 })
  }

  return Response.json({ data: result[0] })
}
