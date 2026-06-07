import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany();
    return NextResponse.json(subjects || []);
  } catch (error) {
    console.error('Subjects API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const { name, code } = await request.json();
    const subject = await prisma.subject.create({ 
      data: { name, code } 
    });
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error('Create subject error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}