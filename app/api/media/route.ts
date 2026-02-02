import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/media — 매체 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/media — 매체 추가
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('media')
      .insert([{
        name: body.name,
        type: body.type,
        location: body.location,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        daily_impressions: body.daily_impressions || 0,
        monthly_price: body.monthly_price || 0,
        size: body.size,
        description: body.description,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
