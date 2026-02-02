import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/proposals — 제안서 목록
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('proposals')
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

// POST /api/proposals — 제안서 PDF 업로드
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 없습니다' },
        { status: 400 }
      );
    }

    // 1. Supabase Storage에 파일 업로드
    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('proposals')
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // 2. 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from('proposals')
      .getPublicUrl(fileName);

    // 3. DB에 제안서 레코드 생성
    const { data: proposal, error: dbError } = await supabase
      .from('proposals')
      .insert([{
        file_name: file.name,
        file_url: urlData.publicUrl,
        status: 'pending',
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data: proposal });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
