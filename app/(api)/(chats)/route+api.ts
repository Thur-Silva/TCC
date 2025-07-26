import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

type ChatRow = {
  id: string;
  partner_id: string;
  last_message: string;
  last_message_at: string;
};

type UserRow = {
  id: string;
  name: string;
  profile_img: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const chats = await sql`
    SELECT
      cp.chat_id AS id,
      CASE WHEN cp.user_id = ${userId} THEN cp2.user_id ELSE cp.user_id END AS partner_id,
      m2.message AS last_message,
      m2.sent_at AS last_message_at
    FROM chat_participants cp
    JOIN chat_participants cp2
      ON cp.chat_id = cp2.chat_id AND cp.user_id = ${userId} AND cp2.user_id != ${userId}
    JOIN LATERAL (
      SELECT * FROM messages
      WHERE chat_id = cp.chat_id
      ORDER BY sent_at DESC LIMIT 1
    ) AS m2 ON true
    GROUP BY cp.chat_id, cp2.user_id, m2.message, m2.sent_at
    ORDER BY m2.sent_at DESC
  ` as ChatRow[];

  const partnerIds = chats.map(c => c.partner_id);

  const partners = await sql`
    SELECT id, name, profile_img FROM users WHERE id = ANY(${partnerIds})
  ` as UserRow[];

  const result = chats.map(chat => {
    const partner = partners.find(p => p.id === chat.partner_id);
    return {
      id: chat.id,
      partnerName: partner?.name ?? "Desconhecido",
      partnerProfileImg: partner?.profile_img ?? "",
      lastMessage: chat.last_message,
      lastMessageAt: chat.last_message_at,
    };
  });

  return Response.json({ data: result });
}
