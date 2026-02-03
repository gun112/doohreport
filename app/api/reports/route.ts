import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/reports — 리포트 목록 또는 단일 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // ID가 있으면 단일 조회
    if (id) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    }

    // ID가 없으면 전체 목록
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

// DELETE /api/reports — 리포트 삭제
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID가 필요합니다' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/reports — 리포트 수정 (나중을 위해)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID가 필요합니다' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from('reports')
      .update({
        title: body.title,
        media_ids: body.media_ids,
        campaign_start: body.campaign_start,
        campaign_end: body.campaign_end,
        target_audience: body.target_audience,
        budget: body.budget,
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
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
