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
        const bus = await databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES, resolvedParams.id);
        
        return NextResponse.json({ data: {
            id: bus.$id,
            plateNumber: bus.plateNumber,
            model: bus.model,
            capacity: bus.capacity,
            assignedRouteId: bus.assignedRouteId,
            createdAt: bus.$createdAt,
            updatedAt: bus.$updatedAt
        } });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Bus not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { plateNumber, model, capacity, assignedRouteId } = await request.json();
        
        if (!plateNumber) return NextResponse.json({ error: 'plateNumber is required' }, { status: 400 });

        const { databases } = createAdminClient();
        
        const bus = await databases.updateDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.BUSES, 
            resolvedParams.id, 
            {
                plateNumber: plateNumber.trim(),
                model: model ?? null,
                capacity: parseInt((capacity ?? 40) as string, 10),
                assignedRouteId: assignedRouteId ?? null
            }
        );

        return NextResponse.json({ data: {
            id: bus.$id,
            plateNumber: bus.plateNumber,
            model: bus.model,
            capacity: bus.capacity,
            assignedRouteId: bus.assignedRouteId,
            createdAt: bus.$createdAt,
            updatedAt: bus.$updatedAt
        } });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Bus not found' }, { status: 404 });
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
        await databases.deleteDocument(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES, resolvedParams.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Bus not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
