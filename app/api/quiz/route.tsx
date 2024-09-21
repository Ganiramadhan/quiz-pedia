// app/api/quiz/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// const API_KEY = process.env.NEXT_PUBLIC_QUIZ_API_KEY;
const API_KEY = 'TB9n4wDPPf5ye2doGgEoZMyJObcMuM2sJROlH1Wg';

export async function GET() {
    try {
        const response = await axios.get(`https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&category=linux&limit=15`);
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch quiz data' }, { status: 500 });
    }
}
