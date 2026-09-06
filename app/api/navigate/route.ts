import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { Query } from 'node-appwrite';

// Haversine distance in meters
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface ResolvedStop {
    stopId: string;
    name: string;
    latitude: number;
    longitude: number;
    order: number;
}

interface ResolvedRoute {
    id: string;
    shortName: string;
    longName: string;
    transport: string | null;
    color: string;
    stops: ResolvedStop[];
}

async function getAllRoutesWithStops(databases: any): Promise<ResolvedRoute[]> {
    const routesRes = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, [
        Query.limit(100),
    ]);

    const routes: ResolvedRoute[] = [];

    for (const routeDoc of routesRes.documents) {
        const routeStopsRes = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            COLLECTIONS.ROUTE_STOPS,
            [Query.equal('routeId', routeDoc.$id), Query.orderAsc('stopOrder'), Query.limit(100)]
        );

        const stopIds = routeStopsRes.documents.map((rs: any) => rs.stopId);
        if (stopIds.length < 2) continue;

        let stopsMap: Record<string, any> = {};
        if (stopIds.length > 0) {
            const stopsRes = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                COLLECTIONS.BUS_STOPS,
                [Query.equal('$id', stopIds), Query.limit(100)]
            );
            for (const s of stopsRes.documents) {
                stopsMap[s.$id] = s;
            }
        }

        const resolvedStops: ResolvedStop[] = routeStopsRes.documents
            .map((rs: any) => {
                const s = stopsMap[rs.stopId];
                if (!s || !s.latitude || !s.longitude) return null;
                return {
                    stopId: rs.stopId,
                    name: s.name,
                    latitude: s.latitude,
                    longitude: s.longitude,
                    order: rs.stopOrder,
                };
            })
            .filter(Boolean) as ResolvedStop[];

        routes.push({
            id: routeDoc.$id,
            shortName: routeDoc.shortName,
            longName: routeDoc.longName,
            transport: routeDoc.transport ?? null,
            color: routeDoc.color ?? '3b82f6',
            stops: resolvedStops,
        });
    }

    return routes;
}

export async function POST(request: NextRequest) {
    try {
        const { originLat, originLng, destStopName } = await request.json();

        if (originLat == null || originLng == null || !destStopName) {
            return NextResponse.json(
                { error: 'originLat, originLng, and destStopName are required' },
                { status: 400 }
            );
        }

        const { databases } = createAdminClient();
        const allRoutes = await getAllRoutesWithStops(databases);

        const destQuery = destStopName.toLowerCase().trim();

        interface RouteLeg {
            routeId: string;
            routeName: string;
            operator: string;
            transport: string | null;
            color: string;
            boardingStop: ResolvedStop & { walkMeters: number; walkMins: number };
            alightingStop: ResolvedStop;
            intermediateStops: ResolvedStop[];
            numStops: number;
        }

        interface RouteOption {
            id: string;
            legs: RouteLeg[];
            estimatedMins: number;
            fareNpr: number;
        }

        const options: RouteOption[] = [];
        const MAX_WALK_METERS = 3000;

        // 1. Identify start routes (routes near user)
        const startCandidates: { route: ResolvedRoute, boardIdx: number, dist: number }[] = [];
        for (const route of allRoutes) {
            let bestIdx = -1;
            let minDist = Infinity;
            for (let i = 0; i < route.stops.length; i++) {
                const dist = haversineMeters(originLat, originLng, route.stops[i].latitude, route.stops[i].longitude);
                if (dist < minDist) {
                    minDist = dist;
                    bestIdx = i;
                }
            }
            if (minDist <= MAX_WALK_METERS) {
                startCandidates.push({ route, boardIdx: bestIdx, dist: minDist });
            }
        }

        // 2. Identify end routes (routes with destination)
        const endCandidates: { route: ResolvedRoute, destIdx: number }[] = [];
        for (const route of allRoutes) {
            const destIdx = route.stops.findIndex(s => s.name.toLowerCase().includes(destQuery) || destQuery.includes(s.name.toLowerCase()));
            if (destIdx !== -1) {
                endCandidates.push({ route, destIdx });
            }
        }

        // Helper to build a leg
        const buildLeg = (route: ResolvedRoute, boardIdx: number, alightIdx: number, walkMeters: number): RouteLeg => {
            const walkMins = Math.ceil(walkMeters / 80);
            return {
                routeId: route.id,
                routeName: route.longName,
                operator: route.shortName,
                transport: route.transport,
                color: route.color,
                boardingStop: { ...route.stops[boardIdx], walkMeters: Math.round(walkMeters), walkMins },
                alightingStop: route.stops[alightIdx],
                intermediateStops: route.stops.slice(boardIdx, alightIdx + 1),
                numStops: alightIdx - boardIdx
            };
        };

        // 3. Find Direct and 1-Transfer Routes
        for (const start of startCandidates) {
            // Check direct routes
            const directEnd = endCandidates.find(e => e.route.id === start.route.id);
            if (directEnd && start.boardIdx < directEnd.destIdx) {
                const leg = buildLeg(start.route, start.boardIdx, directEnd.destIdx, start.dist);
                const rideMins = leg.numStops * 3;
                options.push({
                    id: `dir-${start.route.id}`,
                    legs: [leg],
                    estimatedMins: leg.boardingStop.walkMins + rideMins,
                    fareNpr: 25
                });
                continue; // Found direct, no need to search transfers for this specific start route
            }

            // Check 1-transfer routes
            for (const end of endCandidates) {
                if (start.route.id === end.route.id) continue;
                
                // Find a common stop between startRoute (after boardIdx) and endRoute (before destIdx)
                let transferFound = false;
                for (let i = start.boardIdx + 1; i < start.route.stops.length; i++) {
                    const sStop = start.route.stops[i];
                    for (let j = 0; j < end.destIdx; j++) {
                        const eStop = end.route.stops[j];
                        // Consider it a transfer if stops have same ID or same exact name
                        if (sStop.stopId === eStop.stopId || sStop.name === eStop.name) {
                            const leg1 = buildLeg(start.route, start.boardIdx, i, start.dist);
                            const leg2 = buildLeg(end.route, j, end.destIdx, 0); // 0m walk for transfer
                            const rideMins = (leg1.numStops + leg2.numStops) * 3;
                            
                            options.push({
                                id: `tx-${start.route.id}-${end.route.id}`,
                                legs: [leg1, leg2],
                                estimatedMins: leg1.boardingStop.walkMins + rideMins + 5, // 5 min transfer penalty
                                fareNpr: 50 // 25 + 25
                            });
                            transferFound = true;
                            break;
                        }
                    }
                    if (transferFound) break; // Only take the first transfer point between these two routes
                }
            }
        }

        // Sort by total estimated time
        options.sort((a, b) => a.estimatedMins - b.estimatedMins);

        // Deduplicate by ID
        const uniqueOptions = Array.from(new Map(options.map(item => [item.id, item])).values());

        return NextResponse.json({ data: uniqueOptions.slice(0, 5) });
    } catch (error: any) {
        console.error('Navigate API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
