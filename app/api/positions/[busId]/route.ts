import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { Query, ID } from 'node-appwrite';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ busId: string }> }
) {
    try {
        const resolvedParams = await params;
        const { latitude, longitude, speed, heading, occupancy } = await request.json();
        
        if (latitude == null || longitude == null) {
            return NextResponse.json({ error: 'latitude and longitude are required' }, { status: 400 });
        }

        const { databases } = createAdminClient();
        
        const existing = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, [
            Query.equal('busId', resolvedParams.busId)
        ]);

        if (existing.documents.length > 0) {
            await databases.updateDocument(
                APPWRITE_DATABASE_ID,
                COLLECTIONS.BUS_POSITIONS,
                existing.documents[0].$id,
                {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    speed: parseFloat(speed ?? 0),
                    heading: parseFloat(heading ?? 0),
                    occupancy: parseInt(occupancy ?? 0, 10),
                    updatedAt: new Date().toISOString()
                }
            );
        } else {
            await databases.createDocument(
                APPWRITE_DATABASE_ID,
                COLLECTIONS.BUS_POSITIONS,
                ID.unique(),
                {
                    busId: resolvedParams.busId,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    speed: parseFloat(speed ?? 0),
                    heading: parseFloat(heading ?? 0),
                    occupancy: parseInt(occupancy ?? 0, 10),
                    updatedAt: new Date().toISOString()
                }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
