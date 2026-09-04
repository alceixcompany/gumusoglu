import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_SECONDS,
  createAdminSessionToken,
} from '@/lib/adminSession';

export async function POST(request: Request) {
  const { idToken } = (await request.json()) as { idToken?: string };
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUid = process.env.NEXT_PUBLIC_FIREBASE_BOOTSTRAP_ADMIN_UID;
  const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminEmail || !adminUid || !firebaseApiKey || !sessionSecret) {
    return NextResponse.json({ message: 'Yönetici hesabı henüz yapılandırılmamış.' }, { status: 503 });
  }

  if (!idToken) {
    return NextResponse.json({ message: 'E-posta veya şifre hatalı.' }, { status: 401 });
  }

  const identityResponse = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    },
  );
  const identityData = await identityResponse.json() as {
    users?: Array<{ localId?: string; email?: string }>;
  };
  const firebaseUser = identityData.users?.[0];

  if (
    !identityResponse.ok
    || firebaseUser?.localId !== adminUid
    || firebaseUser.email?.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    return NextResponse.json({ message: 'Bu hesabın yönetici yetkisi bulunmamaktadır.' }, { status: 403 });
  }

  const response = NextResponse.json({
    user: {
      uid: firebaseUser.localId,
      email: firebaseUser.email,
      displayName: 'Gümüşoğlu Elektrik Yönetici',
      isStaticAdmin: false,
      isDatabaseAdmin: true,
    },
  });
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(adminEmail, sessionSecret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });
  return response;
}
