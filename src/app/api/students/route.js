import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: { classStream: true }
    });
    return NextResponse.json(students || []);
  } catch (error) {
    console.error('Students API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const student = await prisma.student.create({
      data: body,
      include: { classStream: true }
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}