import { NextResponse } from 'next/server';
import getRandom from '@/lib/getRandom';

export async function GET() {
    try {
        const driver = getRandom();
        
        if (!driver) {
            return NextResponse.json(
                { error: 'No driver found' },
                { status: 404 }
            );
        }

        console.log(`this is the driver chosen from getRandom ${driver.fullName}`);
        return NextResponse.json(driver);
    } catch (error) {
        console.error('Error in /api/random:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
