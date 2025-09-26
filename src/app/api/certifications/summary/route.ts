// File: app/api/certifications/summary/route.ts

import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Read the userId from the request body
    const { userId } = await request.json();

    // Check for userId to ensure the request is authenticated/authorized
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: User ID is missing.' }, { status: 401 });
    }
    
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    // 2. Find the user's skill-wallet ID using the provided userId
   const { data: wallet, error: walletError } = await supabase
  .from('skill_wallet')
  .select('id')
  .eq('user', userId)
  .single();

console.log("User ID Sent:", userId);
console.log("Wallet Data:", wallet);
console.log("Wallet Error:", walletError); 
    
    // 3. Get all certifications linked to that wallet.
    // We select all columns (*) to get the full certification details.
    const { certifications, certsError } = await supabase
      .from('certifications')
      .select('*') // Select all data for each certification
      .eq('wallet', wallet.id);

    if (certsError) {
      console.error('Certifications fetch error:', certsError);
      return NextResponse.json({ error: 'Failed to fetch certifications.' }, { status: 500 });
    }
    
    // Handle case where no certifications are found
    if (!certifications || certifications.length === 0) {
      return NextResponse.json({
        certifications: [],
        count: 0,
        mainSkills: [],
        secondarySkills: [],
        message: "No certifications found."
      });
    }

    // 4. Process the fetched data to create the desired output
    
    // Get the total count of certifications
    const count = certifications.length;

    // Extract all main skills, filtering out any null or empty values
    const mainSkills = certifications
      .map(cert => cert.main_skill)
      .filter(skill => skill);

    // Extract all secondary skills, filtering out any null or empty values
    const secondarySkills = certifications
      .map(cert => cert.secondary_skill)
      .filter(skill => skill);

    // 5. Return the structured data to the frontend
    return NextResponse.json({
      certifications,   // The full list of certification objects
      count,            // The total number of certifications
      mainSkills,       // An array of main skills
      secondarySkills   // An array of secondary skills
    });

  } catch (error) {
    // Catch any unexpected errors during execution
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
