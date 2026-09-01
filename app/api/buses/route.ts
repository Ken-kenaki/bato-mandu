import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { ID } from 'node-appwrite';

export async function GET() {
    try {
        const { databases } = createAdminClient();
        const response = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES);
        
        const buses = response.documents.map(d => ({
            id: d.$id,
            plateNumber: d.plateNumber,
            model: d.model,
            capacity: d.capacity,
            assignedRouteId: d.assignedRouteId,
            createdAt: d.$createdAt,
            updatedAt: d.$updatedAt
        }));

        return NextResponse.json({ data: buses });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { plateNumber, model, capacity = 40, assignedRouteId } = await request.json();
        
        if (!plateNumber) {
            return NextResponse.json({ error: 'plateNumber is required' }, { status: 400 });
        }

        const { databases } = createAdminClient();
        
        const bus = await databases.createDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.BUSES, 
            ID.unique(), 
            {
                plateNumber: plateNumber.trim(),
                model: model ?? null,
                capacity: parseInt(capacity as string, 10),
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
        } }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
