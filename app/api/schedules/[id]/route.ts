import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { databases } = createAdminClient();
        const schedule = await databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.SCHEDULES, resolvedParams.id);
        
        return NextResponse.json({ data: {
            id: schedule.$id,
            routeId: schedule.routeId,
            departureTime: schedule.departureTime,
            arrivalTime: schedule.arrivalTime,
            days: JSON.parse(schedule.days),
            createdAt: schedule.$createdAt,
            updatedAt: schedule.$updatedAt
        } });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { routeId, departureTime, arrivalTime, days } = await request.json();
        
        if (!routeId || !departureTime || !arrivalTime) {
            return NextResponse.json({ error: 'routeId, departureTime, arrivalTime are required' }, { status: 400 });
        }

        const { databases } = createAdminClient();
        
        const schedule = await databases.updateDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.SCHEDULES, 
            resolvedParams.id, 
            {
                routeId,
                departureTime,
                arrivalTime,
                days: JSON.stringify(days ?? ['Mon','Tue','Wed','Thu','Fri'])
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
        } });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
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
        await databases.deleteDocument(APPWRITE_DATABASE_ID, COLLECTIONS.SCHEDULES, resolvedParams.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
