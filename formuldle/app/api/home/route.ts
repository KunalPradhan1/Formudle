import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'



export async function GET() {
      const { data: rows, error } = await supabase
            .from("History")
            .select('*');

      //console.log(rows);
      return NextResponse.json(rows);
}
