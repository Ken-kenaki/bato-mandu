import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/appwrite-server';
import { COLLECTIONS, APPWRITE_DATABASE_ID } from '@/app/lib/constants';
import { ID } from 'node-appwrite';

export async function GET() {
    try {
        const { databases } = createAdminClient();
        const response = await databases.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS);
        
        const drivers = response.documents.map(d => ({
            id: d.$id,
            name: d.name,
            email: d.email,
            licenseNumber: d.licenseNumber,
            phoneNumber: d.phoneNumber,
            assignedBusId: d.assignedBusId,
            status: d.status,
            hireDate: d.hireDate,
            lastLatitude: d.lastLatitude,
            lastLongitude: d.lastLongitude,
            lastLocationAt: d.lastLocationAt,
            createdAt: d.$createdAt,
            updatedAt: d.$updatedAt
        }));

        return NextResponse.json({ data: drivers });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, email, licenseNumber, phoneNumber, assignedBusId, hireDate } = await request.json();
        
        if (!name || !email || !licenseNumber) {
            return NextResponse.json({ error: 'name, email, licenseNumber are required' }, { status: 400 });
        }

        const { databases } = createAdminClient();
        
        const driver = await databases.createDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.DRIVERS, 
            ID.unique(), 
            {
                name: name.trim(),
                email: email.trim(),
                licenseNumber: licenseNumber.trim(),
                phoneNumber: phoneNumber ?? null,
                assignedBusId: assignedBusId ?? null,
                status: 'active',
                hireDate: hireDate ?? new Date().toISOString().split('T')[0]
            }
        );

        return NextResponse.json({ data: {
            id: driver.$id,
            name: driver.name,
            email: driver.email,
            licenseNumber: driver.licenseNumber,
            phoneNumber: driver.phoneNumber,
            assignedBusId: driver.assignedBusId,
            status: driver.status,
            hireDate: driver.hireDate,
            createdAt: driver.$createdAt,
            updatedAt: driver.$updatedAt
        } }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
