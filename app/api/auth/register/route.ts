import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { ID, AppwriteException } from 'node-appwrite';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, role = 'viewer' } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'name, email, and password are required' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'password must be at least 8 characters' }, { status: 400 });
        }

        const allowedRoles = ['admin', 'operator', 'viewer'];
        if (!allowedRoles.includes(role)) {
            return NextResponse.json({ error: `role must be one of: ${allowedRoles.join(', ')}` }, { status: 400 });
        }

        const { account } = createAdminClient();

        // 1. Create the user
        const user = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        // 2. Set the custom label/role in preferences or create a session.
        // For simplicity, we just return success and user can login.
        // If we want auto-login, we could create an email session, but node-appwrite creates sessions for users differently.
        // Usually, the client SDK should handle login after registration.
        
        return NextResponse.json({ data: { user } }, { status: 201 });
    } catch (error: any) {
        if (error instanceof AppwriteException) {
            if (error.code === 409) {
                return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
            }
        }
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
