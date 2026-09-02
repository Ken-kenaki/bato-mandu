import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { ID, Query } from 'node-appwrite';

// Helper to fetch full route data including ordered stops
async function getFullRoute(routeDoc: any, databases: any) {
    // Get all stops for this route
    const routeStopsRes = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.ROUTE_STOPS, [
        Query.equal('routeId', routeDoc.$id),
        Query.orderAsc('stopOrder')
    ]);

    // This implementation is a bit naive for NoSQL as it requires N queries or 1 big IN query.
    // Let's gather all stopIds and do a single query to bus_stops if possible, or fetch them individually.
    const stopIds = routeStopsRes.documents.map((rs: any) => rs.stopId);
    
    let stops = [];
    if (stopIds.length > 0) {
        // Appwrite IN query supports up to 100 elements. We assume a route has < 100 stops for this demo
        const stopsRes = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS, [
            Query.equal('$id', stopIds),
            Query.limit(100)
        ]);

        // Map them back to the ordered route_stops structure
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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get('limit');
        const offsetParam = searchParams.get('offset');
        const search = searchParams.get('search')?.toLowerCase() || '';
        const transport = searchParams.get('transport');

        const limit = limitParam ? parseInt(limitParam) : 25;
        const offset = offsetParam ? parseInt(offsetParam) : 0;

        const { databases } = createAdminClient();
        
        // Fetch up to 100 to ensure we get all routes in the system for in-memory filtering.
        // If the DB grows significantly, we would need a different approach (e.g., search indexes).
        const response = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, [
            Query.limit(100)
        ]);
        
        let routes = await Promise.all(response.documents.map(d => getFullRoute(d, databases)));

        // Apply filters
        if (transport && transport !== 'all') {
            routes = routes.filter(r => 
                (transport === 'micro' && r.longName.toLowerCase().includes('micro')) ||
                (transport === 'tempo' && r.longName.toLowerCase().includes('tempo')) ||
                (transport === 'bus' && (r.longName.toLowerCase().includes('bus') || r.longName.toLowerCase().includes('sajha'))) ||
                r.transport?.toLowerCase() === transport.toLowerCase()
            );
        }

        if (search) {
            routes = routes.filter(r => {
                const matchesLongName = r.longName.toLowerCase().includes(search);
                const matchesShortName = r.shortName.toLowerCase().includes(search);
                const matchesStops = r.stops.some((stop: any) => stop.name?.toLowerCase().includes(search));
                return matchesLongName || matchesShortName || matchesStops;
            });
        }

        const total = routes.length;
        
        // Paginate the filtered results
        const paginatedRoutes = routes.slice(offset, offset + limit);

        return NextResponse.json({ data: paginatedRoutes, total });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { shortName, longName, color = '3b82f6', textColor = 'ffffff', transport = null, stopIds = [] } = await request.json();
        
        if (!shortName || !longName) {
            return NextResponse.json({ error: 'shortName and longName are required' }, { status: 400 });
        }
        if (!Array.isArray(stopIds) || stopIds.length < 2) {
            return NextResponse.json({ error: 'At least 2 stopIds are required' }, { status: 400 });
        }

        const { databases } = createAdminClient();
        
        const route = await databases.createDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.BUS_ROUTES, 
            ID.unique(), 
            {
                shortName: shortName.trim(),
                longName: longName.trim(),
                color: color.replace('#', ''),
                textColor: textColor.replace('#', ''),
                transport
            }
        );

        // Create route_stops
        for (let i = 0; i < stopIds.length; i++) {
            await databases.createDocument(
                APPWRITE_DATABASE_ID,
                COLLECTIONS.ROUTE_STOPS,
                ID.unique(),
                {
                    routeId: route.$id,
                    stopId: stopIds[i],
                    stopOrder: i + 1
                }
            );
        }

        const fullRoute = await getFullRoute(route, databases);
        return NextResponse.json({ data: fullRoute }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
