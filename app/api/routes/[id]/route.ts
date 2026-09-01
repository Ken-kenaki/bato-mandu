import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { Query, ID } from 'node-appwrite';

async function getFullRoute(routeDoc: any, databases: any) {
    const routeStopsRes = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.ROUTE_STOPS, [
        Query.equal('routeId', routeDoc.$id),
        Query.orderAsc('stopOrder')
    ]);

    const stopIds = routeStopsRes.documents.map((rs: any) => rs.stopId);
    let stops = [];
    
    if (stopIds.length > 0) {
        const stopsRes = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS, [
            Query.equal('$id', stopIds),
            Query.limit(100)
        ]);

        stops = routeStopsRes.documents.map((rs: any) => {
            const s = stopsRes.documents.find((d: any) => d.$id === rs.stopId);
            return {
                id: rs.$id,
                stopId: rs.stopId,
                order: rs.stopOrder,
                name: s?.name,
                latitude: s?.latitude,
                longitude: s?.longitude,
                code: s?.code
            };
        });
    }

    return {
        id: routeDoc.$id,
        shortName: routeDoc.shortName,
        longName: routeDoc.longName,
        color: routeDoc.color,
        textColor: routeDoc.textColor,
        transport: routeDoc.transport ?? null,
        stops
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { databases } = createAdminClient();
        const route = await databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, resolvedParams.id);
        
        const fullRoute = await getFullRoute(route, databases);
        return NextResponse.json({ data: fullRoute });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { shortName, longName, color, textColor, transport, stopIds = [] } = await request.json();
        
        if (!shortName || !longName) {
            return NextResponse.json({ error: 'shortName and longName are required' }, { status: 400 });
        }
        if (!Array.isArray(stopIds) || stopIds.length < 2) {
            return NextResponse.json({ error: 'At least 2 stopIds are required' }, { status: 400 });
        }

        const { databases } = createAdminClient();
        
        const route = await databases.updateDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.BUS_ROUTES, 
            resolvedParams.id, 
            {
                shortName: shortName.trim(),
                longName: longName.trim(),
                color: (color ?? '3b82f6').replace('#', ''),
                textColor: (textColor ?? 'ffffff').replace('#', ''),
                transport: transport ?? null
            }
        );

        // Delete existing route_stops
        const existingStops = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.ROUTE_STOPS, [
            Query.equal('routeId', resolvedParams.id)
        ]);
        
        for (const doc of existingStops.documents) {
            await databases.deleteDocument(APPWRITE_DATABASE_ID, COLLECTIONS.ROUTE_STOPS, doc.$id);
        }

        // Create new route_stops
        for (let i = 0; i < stopIds.length; i++) {
            await databases.createDocument(
                APPWRITE_DATABASE_ID,
                COLLECTIONS.ROUTE_STOPS,
                ID.unique(),
                {
                    routeId: resolvedParams.id,
                    stopId: stopIds[i],
                    stopOrder: i + 1
                }
            );
        }

        const fullRoute = await getFullRoute(route, databases);
        return NextResponse.json({ data: fullRoute });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { databases } = createAdminClient();
        await databases.deleteDocument(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, resolvedParams.id);
        // Note: No native cascade delete, so route_stops should ideally be deleted here too.
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
