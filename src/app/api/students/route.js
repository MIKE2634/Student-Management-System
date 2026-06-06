import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        classStream: true,
        scores: true
      }
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { admissionNo, name, email, phone, address, classStreamId } = body;
    
    const student = await prisma.student.create({
      data: {
        admissionNo,
        name,
        email,
        phone,
        address,
        classStreamId
      },
      include: { classStream: true }
    });
    
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}