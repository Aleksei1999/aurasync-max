import { NextRequest, NextResponse } from 'next/server';
import { validateMaxInitData } from '@/lib/max';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { initData, startParam } = await request.json();

    if (!initData) {
      return NextResponse.json(
        { error: 'Missing initData' },
        { status: 400 }
      );
    }

    // Validate MAX init data (skip in development)
    const isDev = process.env.NODE_ENV === 'development';
    let maxUser;

    if (isDev && initData === 'mock_init_data') {
      // Mock user for development
      maxUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        language_code: 'ru',
      };
    } else {
      const validated = validateMaxInitData(initData);
      if (!validated || !validated.user) {
        return NextResponse.json(
          { error: 'Invalid initData' },
          { status: 401 }
        );
      }
      maxUser = validated.user;
    }

    const supabase = createServerClient();

    // Check if user exists
    const { data: existingProfile } = await supabase
      .from('aura_profiles')
      .select('*')
      .eq('max_id', maxUser.id)
      .single();

    let profile;

    if (existingProfile) {
      // Update existing user
      const { data: updatedProfile, error: updateError } = await supabase
        .from('aura_profiles')
        .update({
          first_name: maxUser.first_name,
          last_name: maxUser.last_name || null,
          username: maxUser.username || null,
          language_code: maxUser.language_code || null,
          is_premium: maxUser.is_premium || false,
          photo_url: maxUser.photo_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('max_id', maxUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }

      profile = updatedProfile;
    } else {
      // Create new user
      const { data: newProfile, error: createError } = await supabase
        .from('aura_profiles')
        .insert({
          max_id: maxUser.id,
          first_name: maxUser.first_name,
          last_name: maxUser.last_name || null,
          username: maxUser.username || null,
          language_code: maxUser.language_code || null,
          is_premium: maxUser.is_premium || false,
          photo_url: maxUser.photo_url || null,
          credits: 0,
          referral_source: startParam || null,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        );
      }

      profile = newProfile;

      // Track new user event
      await supabase.from('aura_user_events').insert({
        max_id: maxUser.id,
        event_type: 'user_registered',
        event_data: {
          referral_source: startParam || null,
          platform: 'max',
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
