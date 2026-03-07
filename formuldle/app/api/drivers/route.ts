import { NextResponse } from 'next/server';
import { getAllDrivers } from '@/lib/getRandom';

export async function GET() {
    try {
        const drivers = await getAllDrivers();
        return NextResponse.json(drivers);
    } catch (error) {
        console.error('Error in /api/drivers:', error);
        return NextResponse.json(
            { error: 'Failed to load drivers' },
            { status: 500 }
        );
    }
}
