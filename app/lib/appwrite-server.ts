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

const FALLBACK_API_KEY = 'standard_b6736cd58459a97ebc632c221b2477eafbe28f6a622afcab27f5d2e9c8c028a233bdd37f4df323fd4ba0396d4e096aa05508d3012d0945eacf1f3e00f0ff4f5f884d891567150c5fabace2542f7694bfe347e36335c1cbb99a69258e7a96327232df123742ba17f79fe869c3fc0302e4519d683847686f3996f239694ffebbd0';

// For Admin server operations (bypasses permissions)
export function createAdminClient(apiKey?: string) {
    const key = apiKey || process.env.APPWRITE_API_KEY || FALLBACK_API_KEY;
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setKey(key);

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
