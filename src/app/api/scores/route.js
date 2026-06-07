import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    const where = studentId ? { studentId } : {};
    const scores = await prisma.score.findMany({
      where,
      include: { subject: true, student: true }
    });
    return NextResponse.json(scores);
  } catch (error) {
    console.error('Scores API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const score = await prisma.score.update({
      where: { id },
      data
    });
    return NextResponse.json(score);
  } catch (error) {
    console.error('Update score error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}