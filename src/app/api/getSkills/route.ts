import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai'

// Initialize the Gemini AI Client
const ai = new GoogleGenAI({});

// Change from GET to POST
export async function POST(request: Request) {
  try {
    // 1. Read the userId from the request body
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: User ID is missing.' }, { status: 401 });
    }
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // 2. Find the user's skill-wallet ID using the provided userId
    const { data: wallet, error: walletError } = await supabase
      .from('skill_wallet')
      .select('id')
      .eq('user', userId) // Use the userId from the body
      .single();

    if (walletError || !wallet) {
      console.error('Wallet error:', walletError);
      return NextResponse.json({ error: 'Skill wallet not found for this user.' }, { status: 404 });
    }

    // ... The rest of the logic remains exactly the same
    // 3. Get all certifications linked to that wallet
    const { data: certifications, error: certsError } = await supabase
      .from('certifications')
      .select('main_skill, secondary_skill')
      .eq('wallet', wallet.id);

    if (certsError) {
      console.error('Certifications error:', certsError);
      return NextResponse.json({ error: 'Failed to fetch certifications.' }, { status: 500 });
    }
    
    if (!certifications || certifications.length === 0) {
      return NextResponse.json({ jobTabs: [], message: "No skills found in certifications." });
    }

    // 4. Aggregate skills
    const allSkills = certifications.flatMap(cert => [cert.main_skill, cert.secondary_skill]);
    const uniqueSkills = [...new Set(allSkills.filter(skill => skill))];

    if (uniqueSkills.length === 0) {
        return NextResponse.json({ jobTabs: [], message: "No valid skills to process." });
    }
    
    // 5. Use Gemini API
    const prompt = `
      Based on the following list of professional skills, generate 1 to 2 relevant job titles or career categories that would be a good fit or just includes it main or seconday skill .
      Return the result as a single, clean JSON array of strings, like ["Job 1", "Job 2"]. Do not include any other text, explanations, or markdown formatting.
      Skills: ${uniqueSkills.join(', ')}
    `;
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const textResponse = result.text;
    console.log(textResponse);

    // 6. Parse and return
    try {
      const cleanedResponse = textResponse.replace(/```json\n|\n```/g, '').trim();
      const jobTabs = JSON.parse(cleanedResponse);
      return NextResponse.json({ jobTabs });
    } catch (parseError) {
      console.error("Gemini response parsing error:", parseError);
      return NextResponse.json({ error: "Failed to parse job suggestions from AI." }, { status: 500 });
    }

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
