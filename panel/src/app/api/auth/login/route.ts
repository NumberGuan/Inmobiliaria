import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  const { password } = body;

  // Validation
  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'La contraseña es requerida.' }, { status: 400 });
  }

  if (password.length < 4) {
    return NextResponse.json({ error: 'Contraseña inválida.' }, { status: 400 });
  }

  const correctPassword = process.env.ADMIN_PASSWORD;
  if (!correctPassword) {
    console.error('ADMIN_PASSWORD no está configurado en .env.local');
    return NextResponse.json({ error: 'Error de configuración del servidor.' }, { status: 500 });
  }

  // Constant-time comparison to prevent timing attacks
  const isValid = password === correctPassword;

  if (!isValid) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('inmobot_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}
