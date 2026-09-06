import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { createAdminClient } from '@/app/lib/appwrite-server';

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // 1. Fetch some basic context from Appwrite
        const { databases: db } = createAdminClient();
        
        // We fetch routes, stops, and links to give rich context to the LLM
        const routesRes = await db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, 
            'bus_routes', 
            [Query.limit(50)]
        );
        const routeStopsRes = await db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, 
            'route_stops', 
            [Query.limit(1000)]
        );
        const stopsRes = await db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, 
            'bus_stops', 
            [Query.limit(1000)]
        );

        const stopMap = new Map();
        for(const s of stopsRes.documents) stopMap.set(s.$id, s.name);
        
        const routeStopsMap = new Map();
        for(const rs of routeStopsRes.documents) {
             if(!routeStopsMap.has(rs.routeId)) routeStopsMap.set(rs.routeId, []);
             routeStopsMap.get(rs.routeId).push({ stopId: rs.stopId, order: rs.stopOrder });
        }
        
        const routesContext = routesRes.documents.map(r => {
             const rsList = routeStopsMap.get(r.$id) || [];
             rsList.sort((a: any, b: any) => a.order - b.order);
             const stopNames = rsList.map((rs: any) => stopMap.get(rs.stopId)).filter(Boolean).join(" -> ");
             return `${r.shortName} (${r.longName}) - ${r.transport}: ${stopNames}`;
        }).join('\n');

        const systemPrompt = `You are a helpful transit assistant for Kathmandu (Bato-Mandu).
Here are the available routes:
${routesContext}

Help the user figure out which route to take. Be extremely concise. Keep the answer under 3 sentences. If you don't know, suggest they check the map.`;

        // 2. Call Cloudflare AI
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const apiToken = process.env.CLOUDFLARE_API_TOKEN;
        const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/meta/llama-3.1-8b-instruct';

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
