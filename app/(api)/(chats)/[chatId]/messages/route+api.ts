import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

type Message = {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  sent_at: string;
  profile_img: string;
};

export async function GET(request: Request, { params }: { params: { chatId: string } }) {
  const chatId = params.chatId;

  const messages = await sql`
    SELECT 
      m.id,
      m.sender_id,
      m.sender_name,
      m.message,
      m.sent_at,
      u.profile_img
    FROM messages m
    JOIN users u ON u.id::text = m.sender_id
    WHERE m.chat_id = ${chatId}
    ORDER BY m.sent_at
  ` as Message[];

  return Response.json({ data: messages });
}

export async function POST(request: Request, { params }: { params: { chatId: string } }) {
  const chatId = params.chatId;
  const { senderId, senderName, message } = await request.json();

  if (!senderId || !senderName || !message) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const inserted = await sql`
    INSERT INTO messages (chat_id, sender_id, sender_name, message, sent_at)
    VALUES (${chatId}, ${senderId}, ${senderName}, ${message}, NOW())
    RETURNING id, sent_at
  ` as { id: string; sent_at: string }[];

  return Response.json({ data: inserted[0] }, { status: 201 });
}
