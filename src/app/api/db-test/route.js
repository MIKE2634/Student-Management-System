import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client'; 
 
export async function GET() { 
  let prisma = null; 
  try { 
    console.log('Testing database...'); 
    prisma = new PrismaClient(); 
    const result = await prisma.$queryRaw`SELECT 1 as connected, NOW() as time`; 
    return NextResponse.json({ success: true, message: 'Database connected!', time: result[0].time }); 
  } catch (error) { 
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }); 
  } finally { 
    if (prisma) await prisma.$disconnect(); 
  } 
} 
