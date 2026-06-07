import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany();
    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Subjects API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const subject = await prisma.subject.update({
      where: { id },
      data
    });
    return NextResponse.json(subject);
  } catch (error) {
    console.error('Update subject error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await prisma.subject.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete subject error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}