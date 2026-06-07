import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    const where = studentId ? { studentId } : {};
    const scores = await prisma.score.findMany({
      where,
      include: { subject: true }
    });
    return NextResponse.json(scores || []);
  } catch (error) {
    console.error('Scores API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const score = await prisma.score.create({ data: body });
    return NextResponse.json(score, { status: 201 });
  } catch (error) {
    console.error('Create score error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}