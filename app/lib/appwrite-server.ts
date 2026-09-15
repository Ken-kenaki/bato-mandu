import { Client, Databases, Users, Account } from 'node-appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from './constants';

// Patch global fetch to remove Node.js specific options that node-appwrite might add
// which are not supported by Cloudflare Workers/Pages edge environment
if (!(globalThis as any).__fetchPatched) {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        if (init) {
            // Strip out unsupported options passed by node-appwrite
            delete (init as any).ALPNProtocols;
            delete (init as any).agent;
        }
        return originalFetch(input, init);
    };
    (globalThis as any).__fetchPatched = true;
}

// For Admin server operations (bypasses permissions)
export function createAdminClient(apiKey?: string) {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setKey((apiKey || process.env.APPWRITE_API_KEY) as string);

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
