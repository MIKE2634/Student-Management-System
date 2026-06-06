import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');
  
  try {
    const where = classId ? { classStreamId: classId } : {};
    const students = await prisma.student.findMany({
      where,
      include: {
        classStream: true,
        scores: {
          include: { subject: true }
        }
      },
      orderBy: { name: 'asc' }
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

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    const student = await prisma.student.update({
      where: { id },
      data
    });
    
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}