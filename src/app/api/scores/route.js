import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
  try {
    const { studentId, subjectId, examScore, caScore, term, year } = await request.json();
    
    const score = await prisma.score.create({
      data: {
        studentId,
        subjectId,
        examScore,
        caScore,
        term,
        year
      }
    });
    
    return NextResponse.json(score, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  
  try {
    const where = studentId ? { studentId } : {};
    const scores = await prisma.score.findMany({
      where,
      include: {
        student: true,
        subject: true
      }
    });
    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}