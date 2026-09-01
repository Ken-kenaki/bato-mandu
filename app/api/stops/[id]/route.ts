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
        const stop = await databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS, resolvedParams.id);
        
        return NextResponse.json({ data: {
            id: stop.$id,
            code: stop.code ?? null,
            name: stop.name,
            latitude: stop.latitude,
            longitude: stop.longitude,
            createdAt: stop.$createdAt,
            updatedAt: stop.$updatedAt
        } });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { code, name, latitude, longitude } = await request.json();
        
        if (!name || latitude == null || longitude == null) {
            return NextResponse.json({ error: 'name, latitude, longitude are required' }, { status: 400 });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (isNaN(lat)) return NextResponse.json({ error: 'Invalid latitude' }, { status: 400 });
        if (isNaN(lng)) return NextResponse.json({ error: 'Invalid longitude' }, { status: 400 });

        const { databases } = createAdminClient();
        
        const stop = await databases.updateDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.BUS_STOPS, 
            resolvedParams.id, 
            {
                code: code?.trim() || null,
                name: name.trim(),
                latitude: lat,
                longitude: lng
            }
        );

        return NextResponse.json({ data: {
            id: stop.$id,
            code: stop.code ?? null,
            name: stop.name,
            latitude: stop.latitude,
            longitude: stop.longitude,
            createdAt: stop.$createdAt,
            updatedAt: stop.$updatedAt
        } });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
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
        await databases.deleteDocument(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS, resolvedParams.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
