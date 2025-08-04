import { DriverRegistrationData } from '@/types/types';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL as string);

    const clerkId = request.headers.get('x-clerk-id');
    if (!clerkId) {
      return Response.json({ error: 'clerk_id é obrigatório no header' }, { status: 400 });
    }

    let data: DriverRegistrationData;
    try {
      data = await request.json();
    } catch {
      return Response.json({ error: 'JSON inválido' }, { status: 400 });
    }

    // A lógica de transação é agora gerenciada pelo try...catch.
    // As queries são executadas em sequência. Se uma falhar, a execução para.

    // 1. Atualiza dados do usuário existentes (cpf, rg, contato, etc.)
    await sql`
      UPDATE users SET
        cpf=${data.cpf},
        rg=${data.rg},
        contact_phone=${data.contactPhone},
        emergency_phone=${data.emergencyPhone},
        gender=${data.gender},
        bio=${data.bio}
      WHERE clerk_id=${clerkId}
    `;

    // 2. Verifica se o registro de motorista já existe
    const driverExists = await sql`
      SELECT 1 FROM drivers WHERE clerk_id=${clerkId}
    `;

    if (driverExists.length === 0) {
      // 3. Se não existir, insere um novo registro de motorista
      await sql`
        INSERT INTO drivers (
          clerk_id, cpf, rg, contact_phone, emergency_phone, gender, bio,
          cnh_info, cnh_validity, has_ear,
          car_brand, car_model, car_plate, car_color, car_year
        ) VALUES (
          ${clerkId},
          ${data.cpf},
          ${data.rg},
          ${data.contactPhone},
          ${data.emergencyPhone},
          ${data.gender},
          ${data.bio},
          ${data.cnhInfo},
          ${data.cnhValidity},
          ${data.hasEar},
          ${data.carBrand},
          ${data.carModel},
          ${data.carPlate},
          ${data.carColor},
          ${data.carYear}
        )
      `;
    }

    return Response.json({ message: 'Motorista registrado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return Response.json({ error: 'Método não permitido' }, { status: 405 });
}
