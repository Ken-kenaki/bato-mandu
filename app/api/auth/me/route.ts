import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient } from '@/app/lib/appwrite-server';

// We get the current user session
export async function GET(request: NextRequest) {
    try {
        const sessionToken = request.cookies.get('appwrite-session')?.value 
                           || request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!sessionToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { account } = createSessionClient(sessionToken);
        const user = await account.get();

        return NextResponse.json({ data: user });
    } catch (error: any) {
        return NextResponse.json({ error: 'Unauthorized or session expired' }, { status: 401 });
    }
}
