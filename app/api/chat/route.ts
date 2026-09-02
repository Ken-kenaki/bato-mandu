import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // 1. Fetch some basic context from Appwrite
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
        const db = new Databases(client);
        
        // We fetch a list of routes to give context to the LLM
        const routesRes = await db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, 
            'bus_routes', 
            [Query.limit(50)]
        );
        
        const routesContext = routesRes.documents.map(r => `${r.shortName} (${r.longName}) - ${r.transport}`).join('\n');

        const systemPrompt = `You are a helpful transit assistant for Kathmandu (Bato-Mandu).
Here are the available routes:
${routesContext}

Help the user figure out which route to take. Be extremely concise. Keep the answer under 3 sentences. If you don't know, suggest they check the map.`;

        // 2. Call Cloudflare AI
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const apiToken = process.env.CLOUDFLARE_API_TOKEN;
        const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/meta/llama-3-8b-instruct';

        const aiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

        const aiRes = await fetch(aiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: query }
                ]
            })
        });

        if (!aiRes.ok) {
            const error = await aiRes.text();
            console.error('Cloudflare Error:', error);
            return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
        }

        const data = await aiRes.json();
        
        return NextResponse.json({ 
            response: data.result.response || "I couldn't process that request." 
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
