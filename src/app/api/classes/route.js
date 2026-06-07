import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const classes = await prisma.classStream.findMany({
      include: { students: true }
    });
    return NextResponse.json(classes || []);
  } catch (error) {
    console.error('Classes API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const { name, code } = await request.json();
    const newClass = await prisma.classStream.create({ 
      data: { name, code } 
    });
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Create class error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}