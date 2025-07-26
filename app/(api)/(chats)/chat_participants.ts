import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chatId, userId } = body;

    if (!chatId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO chat_participants (chat_id, user_id)
      VALUES (${chatId}, ${userId})
      ON CONFLICT (chat_id, user_id) DO NOTHING;
    `;

    return new Response(JSON.stringify({ message: 'Participant added' }), { status: 201 });
  } catch (error: any) {
    console.error('[POST chat_participant]:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
