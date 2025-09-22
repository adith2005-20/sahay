import { NextResponse } from "next/server";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_country: string;
}

interface JSearchResponse {
  data: Job[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: "Query parameter either empty or not received" }, { status: 400 });
  }

  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
  const api_key = process.env.RAPIDAPI_KEY!;
  console.log(api_key);
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json() as JSearchResponse;

    return NextResponse.json({ data: result}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to fetch jobs for the user" }, { status: 500 });
  }
}


