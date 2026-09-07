import { Client, Account, Databases } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from './constants';

// Lazily initialize the client so module evaluation during Next.js static
// prerendering does not throw when env vars are absent at build time.
let _client: Client | null = null;

function getClient(): Client {
    if (!_client) {
        if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
            throw new Error(
                'Missing Appwrite env vars: NEXT_PUBLIC_APPWRITE_ENDPOINT and/or NEXT_PUBLIC_APPWRITE_PROJECT_ID'
            );
        }
        _client = new Client()
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID);
    }
    return _client;
}

export const account = new Proxy({} as Account, {
    get(_target, prop) {
        return (new Account(getClient()) as never)[prop as keyof Account];
    },
});

export const databases = new Proxy({} as Databases, {
    get(_target, prop) {
        return (new Databases(getClient()) as never)[prop as keyof Databases];
    },
});

export default { get client() { return getClient(); } };

