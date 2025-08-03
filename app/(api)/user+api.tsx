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

export async function GET(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        
        // Crie um objeto URL para analisar os parâmetros de busca
        const { searchParams } = new URL(request.url);
        const clerkId = searchParams.get('clerkId');

        if (!clerkId) {
            return Response.json({ error: 'clerkId is required' }, { status: 400 });
        }

        const [user] = await sql`
            SELECT * FROM users
            WHERE clerk_id = ${clerkId};
        `;

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        return Response.json({ data: user }, { status: 200 });

    } catch (err) {
        console.log("Error:", err);
        return Response.json({ error: err }, { status: 500 });
    }
}