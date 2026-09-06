import { NextRequest, NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';
import { createAdminClient } from '@/app/lib/appwrite-server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
            
        const account = new Account(client);
        const session = await account.createEmailPasswordSession(email, password);

        // Fetch user details to return in response
        const { users } = createAdminClient();
        const user = await users.get(session.userId);

        return NextResponse.json({ data: { user, session } }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Login failed' }, { status: 401 });
    }
}
