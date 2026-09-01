import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { ID } from 'node-appwrite';

export async function GET() {
    try {
        const { databases } = createAdminClient();
        const response = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.SCHEDULES);
        
        const schedules = response.documents.map(s => ({
            id: s.$id,
            routeId: s.routeId,
            departureTime: s.departureTime,
            arrivalTime: s.arrivalTime,
            days: typeof s.days === 'string' ? JSON.parse(s.days) : s.days,
            createdAt: s.$createdAt,
            updatedAt: s.$updatedAt
        }));

        return NextResponse.json({ data: schedules });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { routeId, departureTime, arrivalTime, days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] } = await request.json();
        
        if (!routeId || !departureTime || !arrivalTime) {
            return NextResponse.json({ error: 'routeId, departureTime, arrivalTime are required' }, { status: 400 });
        }

        const { databases } = createAdminClient();
        
        const schedule = await databases.createDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.SCHEDULES, 
            ID.unique(), 
            {
                routeId,
                departureTime,
                arrivalTime,
                days: JSON.stringify(days)
            }
        );

        return NextResponse.json({ data: {
            id: schedule.$id,
            routeId: schedule.routeId,
            departureTime: schedule.departureTime,
            arrivalTime: schedule.arrivalTime,
            days: JSON.parse(schedule.days),
            createdAt: schedule.$createdAt,
            updatedAt: schedule.$updatedAt
        } }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
