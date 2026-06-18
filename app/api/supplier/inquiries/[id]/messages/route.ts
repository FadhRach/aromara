import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id: inquiryId } = await params;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('inquiry_id', inquiryId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: messages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id: inquiryId } = await params;
    const body = await request.json();
    const { sender_id, body: messageBody } = body;

    if (!sender_id || !messageBody?.trim()) {
      return NextResponse.json(
        { success: false, error: 'sender_id dan body diperlukan' },
        { status: 400 }
      );
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        inquiry_id: inquiryId,
        sender_id,
        body: messageBody.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: message });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
