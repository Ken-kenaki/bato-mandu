import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { ID, Query } from 'node-appwrite';

export async function GET() {
    try {
        const { databases } = createAdminClient();
        
        const [positionsRes, busesRes, driversRes] = await Promise.all([
            databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, [Query.limit(100)]),
            databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES, [Query.limit(100)]),
            databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, [Query.limit(100)])
        ]);

        const positions = positionsRes.documents.map(bp => {
            const bus = busesRes.documents.find((b: any) => b.$id === bp.busId);
            const driver = driversRes.documents.find((d: any) => d.assignedBusId === bp.busId);
            
            return {
                busId: bp.busId,
                latitude: bp.latitude,
                longitude: bp.longitude,
                speed: bp.speed,
                heading: bp.heading,
                occupancy: bp.occupancy,
                updatedAt: bp.updatedAt,
                capacity: bus?.capacity,
                routeId: bus?.assignedRouteId,
                driverId: driver?.$id,
                driverName: driver?.name
            };
        });

        return NextResponse.json({ data: positions });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
