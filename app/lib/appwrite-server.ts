import { Client, Databases, Users, Account } from 'node-appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from './constants';

// For Admin server operations (bypasses permissions)
export function createAdminClient() {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY!);

    return {
        get account() { return new Account(client); },
        get databases() { return new Databases(client); },
        get users() { return new Users(client); }
    };
}

// For session-based server operations (acting on behalf of a user)
export function createSessionClient(sessionToken: string) {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID);

    if (sessionToken) {
        client.setSession(sessionToken);
    }

    return {
        get account() { return new Account(client); },
        get databases() { return new Databases(client); }
    };
}
