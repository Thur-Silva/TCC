import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// Verifique se a variável de ambiente existe
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY não foi definida.");
}

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
  clerk_id: string;
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
      cp2.user_id AS partner_id,
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
    ORDER BY m2.sent_at DESC
  ` as ChatRow[];

  const partnerIds = chats.map(c => c.partner_id);

  const partners = await sql`
    SELECT id, name, profile_img, clerk_id FROM users WHERE id = ANY(${partnerIds})
  ` as UserRow[];

  console.log(`[GET chats] Fetched ${chats.length} chats for userId: ${userId} and patnerId:`);

  // Usamos Promise.all para processar as buscas de imagem de forma assíncrona
  const result = await Promise.all(chats.map(async chat => {
    const partner = partners.find(p => p.id === chat.partner_id);
    
    let partnerProfileImgUrl = "";

    // 1. Tenta a imagem do banco de dados
    if (partner?.profile_img && partner.profile_img.length > 0) {
      partnerProfileImgUrl = partner.profile_img;
    } 
    // 2. Se a do DB for vazia, tenta buscar no Clerk via API fetch
    else if (partner?.clerk_id) {
      try {
        const clerkUserResponse = await fetch(`https://api.clerk.com/v1/users/${partner.clerk_id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (clerkUserResponse.ok) {
          const clerkUser = await clerkUserResponse.json();
          if (clerkUser.image_url) {
            partnerProfileImgUrl = clerkUser.image_url;
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar usuário do Clerk com ID ${partner.clerk_id}:`, error);
      }
    }

    return {
      id: chat.id,
      partnerName: partner?.name ?? "Desconhecido",
      partnerProfileImg: partnerProfileImgUrl,
      lastMessage: chat.last_message,
      lastMessageAt: chat.last_message_at,
      partnerId: partner?.id,
      partnerClerkId: partner?.clerk_id,
    };
  }));

  return Response.json({ data: result });
}

export async function POST(request: Request) {
  console.error("POST method not implemented.");
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
