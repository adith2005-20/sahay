import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';

// Define a type for the incoming request body for type safety
interface CertificationRequestBody {
  user: string;
  certificate_number?: string;
  main_skill: string;
  secondary_skill?: string;
  certification_name: string;
  certification_file?: string;
  issued_at: string;
}

// Define types for the database table shapes
interface SkillWallet {
  id: string;
  user: string;
}

interface Certification {
  id: string;
  wallet: string;
  certificate_number: string | null;
  main_skill: string;
  secondary_skill: string | null;
  certification_name: string;
  certification_file: string | null;
  issued_at: string;
  created_at: string;
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabaseServer = await createClient(cookieStore);
    
    const body = await request.json() as CertificationRequestBody;
    
   
    const {
      user,
      certificate_number,
      main_skill,
      secondary_skill,
      certification_name,
      certification_file,
      issued_at,
    } = body;

    // Basic validation
    if (!user || !certification_name || !main_skill || !issued_at) {
      return NextResponse.json(
        { error: "Missing required fields. user, certification_name, main_skill, and issued_at are required." },
        { status: 400 }
      );
    }

    // Find or create the user's skill wallet
    let skillWalletId: string;

    const { data: existingWallet, error: walletError } = await supabaseServer
      .from('skill_wallet')
      .select('id')
      .eq('user', user)
      .single<Pick<SkillWallet, 'id'>>();

    if (walletError && walletError.code !== 'PGRST116') { // PGRST116 is "No rows found"
      throw new Error(`Error checking for skill wallet: ${walletError.message}`);
    }

    if (existingWallet) {
      skillWalletId = existingWallet.id;
    } else {
      const { data: newWallet, error: newWalletError } = await supabaseServer
        .from('skill_wallet')
        .insert({ user: user })
        .select('id')
        .single<Pick<SkillWallet, 'id'>>();
      
      if (newWalletError || !newWallet) {
        throw new Error(`Failed to create skill wallet: ${newWalletError?.message ?? 'Unknown error'}`);
      }
      skillWalletId = newWallet.id;
    }

    // Insert the new certification linked to the skill wallet
    const newCertification = {
      wallet: skillWalletId,
      certificate_number: certificate_number ?? null,
      main_skill,
      secondary_skill: secondary_skill ?? null,
      certification_name,
      certification_file: certification_file ?? null,
      issued_at,
    };

    const { data: certificationData, error: certificationError } = await supabaseServer
      .from('certifications')
      .insert([newCertification])
      .select()
      .single<Certification>();
      
    if (certificationError) {
      throw new Error(`Failed to add certification: ${certificationError.message}`);
    }

    return NextResponse.json(
      { message: 'Certification added successfully', data: certificationData },
      { status: 201 }
    );

  } catch (err: unknown) {
    if (err instanceof SyntaxError) {
         return NextResponse.json({ error: 'Invalid JSON format in the request body.' }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
    console.error('API Error:', errorMessage);
    return NextResponse.json({ error: "An error occurred while processing the request.", details: errorMessage }, { status: 500 });
  }
}

