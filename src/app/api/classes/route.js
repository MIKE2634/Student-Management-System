import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Fetching classes...');
    const classes = await prisma.classStream.findMany({
      include: { students: true }
    });
    console.log('Classes found:', classes.length);
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Classes API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await prisma.classStream.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete class error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}