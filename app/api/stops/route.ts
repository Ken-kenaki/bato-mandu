import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { ID } from 'node-appwrite';

export async function GET() {
    try {
        const { databases } = createAdminClient();
        const response = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS);
        
        const stops = response.documents.map(s => ({
            id: s.$id,
            code: s.code ?? null,
            name: s.name,
            latitude: s.latitude,
            longitude: s.longitude,
            createdAt: s.$createdAt,
            updatedAt: s.$updatedAt
        }));

        return NextResponse.json({ data: stops });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { code, name, latitude, longitude } = await request.json();
        
        if (!name || latitude == null || longitude == null) {
            return NextResponse.json({ error: 'name, latitude, longitude are required' }, { status: 400 });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (isNaN(lat) || lat < -90 || lat > 90) return NextResponse.json({ error: 'Invalid latitude' }, { status: 400 });
        if (isNaN(lng) || lng < -180 || lng > 180) return NextResponse.json({ error: 'Invalid longitude' }, { status: 400 });

        const { databases } = createAdminClient();
        
        const stop = await databases.createDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.BUS_STOPS, 
            ID.unique(), 
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
        } }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
