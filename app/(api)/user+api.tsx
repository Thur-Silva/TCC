import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  console.warn("Está batendo na [/api]/(user)+api.ts");
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId, imageUrl } = await request.json();

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
        clerk_id,
        profile_img
      )
      VALUES (
        ${name},
        ${email},
        ${clerkId},
        ${imageUrl || null}
      )
      ON CONFLICT (clerk_id) DO NOTHING
      RETURNING *;
    `;

    return new Response(JSON.stringify({ data: response }), { status: 201 });

  } catch (err) {
    console.log("Erro:", err);
    return Response.json({ error: err }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

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

export async function PUT(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return Response.json({ error: 'clerkId is required' }, { status: 400 });
    }

    const updates = await request.json();

    const allowedUserFields = [
      'name',
      'email',
      'birth_date',
      'gender',
      'bio',
      'profile_img',
      'cpf',
      'rg',
      'contact_phone',
      'emergency_phone',
    ];

    const validUpdates = Object.entries(updates).filter(
      ([key, value]) =>
        allowedUserFields.includes(key) && value !== undefined && value !== null,
    );

    if (validUpdates.length === 0) {
      return Response.json(
        { error: 'Nenhum campo válido fornecido para atualização' },
        { status: 400 },
      );
    }

    // Abordagem corrigida: múltiplas queries individuais para cada campo
    const updates_made = [];
    
    if (updates.bio !== undefined) {
      const result = await sql`
        UPDATE users 
        SET bio = ${updates.bio}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
        RETURNING *
      `;
      if (result.length > 0) updates_made.push('bio');
    }
    
    if (updates.name !== undefined) {
      await sql`
        UPDATE users 
        SET name = ${updates.name}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('name');
    }
    
    if (updates.email !== undefined) {
      await sql`
        UPDATE users 
        SET email = ${updates.email}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('email');
    }
    
    if (updates.gender !== undefined) {
      await sql`
        UPDATE users 
        SET gender = ${updates.gender}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('gender');
    }
    
    if (updates.birth_date !== undefined) {
      await sql`
        UPDATE users 
        SET birth_date = ${updates.birth_date}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('birth_date');
    }
    
    if (updates.profile_img !== undefined) {
      await sql`
        UPDATE users 
        SET profile_img = ${updates.profile_img}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('profile_img');
    }
    
    if (updates.cpf !== undefined) {
      await sql`
        UPDATE users 
        SET cpf = ${updates.cpf}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('cpf');
    }
    
    if (updates.rg !== undefined) {
      await sql`
        UPDATE users 
        SET rg = ${updates.rg}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('rg');
    }
    
    if (updates.contact_phone !== undefined) {
      await sql`
        UPDATE users 
        SET contact_phone = ${updates.contact_phone}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('contact_phone');
    }
    
    if (updates.emergency_phone !== undefined) {
      await sql`
        UPDATE users 
        SET emergency_phone = ${updates.emergency_phone}, updated_at = NOW()
        WHERE clerk_id = ${clerkId}
      `;
      updates_made.push('emergency_phone');
    }
    
    if (updates_made.length === 0) {
      return Response.json({ error: `Usuário ${clerkId} não encontrado` }, { status: 404 });
    }
    
    // Buscar o usuário atualizado
    const [response] = await sql`
      SELECT * FROM users WHERE clerk_id = ${clerkId}
    `;

    if (!response) {
      return Response.json({ error: `Usuário ${clerkId} não encontrado` }, { status: 404 });
    }


    return Response.json({ data: response }, { status: 200 });

  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}