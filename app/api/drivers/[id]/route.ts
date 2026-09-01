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
        const driver = await databases.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, resolvedParams.id);
        
        return NextResponse.json({ data: {
            id: driver.$id,
            name: driver.name,
            email: driver.email,
            licenseNumber: driver.licenseNumber,
            phoneNumber: driver.phoneNumber,
            assignedBusId: driver.assignedBusId,
            status: driver.status,
            hireDate: driver.hireDate,
            lastLatitude: driver.lastLatitude,
            lastLongitude: driver.lastLongitude,
            lastLocationAt: driver.lastLocationAt,
            createdAt: driver.$createdAt,
            updatedAt: driver.$updatedAt
        } });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { name, email, licenseNumber, phoneNumber, assignedBusId, status } = await request.json();
        
        if (!name || !email || !licenseNumber) {
            return NextResponse.json({ error: 'name, email, licenseNumber are required' }, { status: 400 });
        }

        const { databases } = createAdminClient();
        
        const driver = await databases.updateDocument(
            APPWRITE_DATABASE_ID, 
            COLLECTIONS.DRIVERS, 
            resolvedParams.id, 
            {
                name: name.trim(),
                email: email.trim(),
                licenseNumber: licenseNumber.trim(),
                phoneNumber: phoneNumber ?? null,
                assignedBusId: assignedBusId ?? null,
                status: status ?? 'active'
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
        } });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
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
        await databases.deleteDocument(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, resolvedParams.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 404) return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
