import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export function withAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
      const decoded = verifyToken(token);
      return await handler(req, decoded, ...args);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}
