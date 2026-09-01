import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { AppwriteException } from 'node-appwrite';

// This acts as a proxy to Appwrite's createEmailPasswordSession
// However, since node-appwrite (server SDK) uses admin keys, it doesn't create 
// sessions for the end user in the same way the client SDK does.
// Standard Appwrite architecture relies on the client (browser) SDK to call account.createEmailPasswordSession()
// For this route, we'll return an error explaining that login should happen on the client-side.
// We could technically implement this by creating a session token and sending it back, but 
// it's much safer and standard to do it client-side.

export async function POST(request: NextRequest) {
    return NextResponse.json(
        { error: 'Please use the client-side Appwrite SDK (account.createEmailPasswordSession) to login.' },
        { status: 400 }
    );
}
