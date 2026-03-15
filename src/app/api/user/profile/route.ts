import { NextRequest, NextResponse } from 'next/server';
import { validateMaxInitData } from '@/lib/max';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const initData = request.headers.get('X-Max-Init-Data');

    if (!initData) {
      return NextResponse.json(
        { error: 'Missing initData' },
        { status: 400 }
      );
    }

    // Validate and get user
    const isDev = process.env.NODE_ENV === 'development';
    let maxId: number;

    if (isDev && initData === 'mock_init_data') {
      maxId = 123456789;
    } else {
      const validated = validateMaxInitData(initData);
      if (!validated || !validated.user) {
        return NextResponse.json(
          { error: 'Invalid initData' },
          { status: 401 }
        );
      }
      maxId = validated.user.id;
    }

    const supabase = createServerClient();

    const { data: profile, error } = await supabase
      .from('aura_profiles')
      .select('*')
      .eq('max_id', maxId)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const initData = request.headers.get('X-Max-Init-Data');

    if (!initData) {
      return NextResponse.json(
        { error: 'Missing initData' },
        { status: 400 }
      );
    }

    // Validate and get user
    const isDev = process.env.NODE_ENV === 'development';
    let maxId: number;

    if (isDev && initData === 'mock_init_data') {
      maxId = 123456789;
    } else {
      const validated = validateMaxInitData(initData);
      if (!validated || !validated.user) {
        return NextResponse.json(
          { error: 'Invalid initData' },
          { status: 401 }
        );
      }
      maxId = validated.user.id;
    }

    const updates = await request.json();

    // Whitelist of allowed fields to update
    const allowedFields = [
      'onboarding_completed',
      'preferred_time_morning',
      'preferred_time_evening',
      'goals',
      'current_mood',
    ];

    const filteredUpdates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data: profile, error } = await supabase
      .from('aura_profiles')
      .update({
        ...filteredUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('max_id', maxId)
      .select()
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
