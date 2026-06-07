import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const term = searchParams.get('term');
    const year = searchParams.get('year');

    if (!classId || !term || !year) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Get all students in the class
    const students = await prisma.student.findMany({
      where: { classStreamId: classId },
      include: {
        scores: {
          where: { term, year: parseInt(year) },
          include: { subject: true }
        }
      }
    });

    // Get grade scales
    const gradeScales = await prisma.gradeScale.findMany();

    // Process results for each student
    const results = students.map(student => {
      let totalMarks = 0;
      const subjectResults = [];

      for (const score of student.scores) {
        const totalScore = (score.examScore || 0) + (score.caScore || 0);
        totalMarks += totalScore;
        
        const grade = gradeScales.find(g => 
          totalScore >= g.minScore && totalScore <= g.maxScore
        );

        subjectResults.push({
          subjectId: score.subjectId,
          subjectName: score.subject.name,
          examScore: score.examScore,
          caScore: score.caScore,
          total: totalScore,
          grade: grade?.grade || 'N/A',
          points: grade?.points || 0
        });
      }

      const averageScore = student.scores.length > 0 ? totalMarks / student.scores.length : 0;
      const overallGrade = gradeScales.find(g => 
        averageScore >= g.minScore && averageScore <= g.maxScore
      );

      return {
        studentId: student.id,
        studentName: student.name,
        admissionNo: student.admissionNo,
        totalMarks,
        averageScore,
        overallGrade: overallGrade?.grade || 'N/A',
        totalPoints: subjectResults.reduce((sum, s) => sum + s.points, 0),
        subjects: subjectResults
      };
    });

    // Sort by total marks for ranking
    results.sort((a, b) => b.totalMarks - a.totalMarks);
    
    // Add ranks
    const rankedResults = results.map((result, index) => ({
      ...result,
      position: index + 1
    }));

    return NextResponse.json(rankedResults);
  } catch (error) {
    console.error('Results error:', error);
    return NextResponse.json({ error: 'Failed to process results' }, { status: 500 });
  }
}