import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/reports — 리포트 목록
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
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

// POST /api/reports — 리포트 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('reports')
      .insert([{
        title: body.title,
        proposal_id: body.proposal_id || null,
        media_ids: body.media_ids || [],
        campaign_start: body.campaign_start || null,
        campaign_end: body.campaign_end || null,
        target_audience: body.target_audience || null,
        budget: body.budget || null,
        status: 'draft',
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
