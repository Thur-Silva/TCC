import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  console.error("Está batendo na [/api]/(user)+api.ts");  
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: 'Preencha todos os campos' },
        { status: 400 }
      );
    }

    const response = await sql`
      INSERT INTO users(
        name,
        email,
        clerk_id
      )
      VALUES (
        ${name},
        ${email},
        ${clerkId}
      );
    `;
    console.log('Usuário criado com sucesso:', response);
    return new Response(JSON.stringify({ data: response }), { status: 201 });

  } catch (err) {
    console.log("Erro:", err);
    return Response.json({ error: err }, { status: 500 });
  }
}
