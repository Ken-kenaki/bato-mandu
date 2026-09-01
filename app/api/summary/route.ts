import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';

export async function GET(request: NextRequest) {
    try {
        const { databases, users } = createAdminClient();

        const [buses, routes, schedules, positions] = await Promise.all([
            databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES),
            databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES),
            databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.SCHEDULES),
            databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS)
        ]);

        return NextResponse.json({
            data: {
                totalBuses: buses.total,
                totalRoutes: routes.total,
                totalDrivers: 0, // Would query drivers collection if implemented
                activeBuses: positions.total
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
