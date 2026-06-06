const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const gradeScales = [
    { minScore: 80, maxScore: 100, grade: 'A', points: 12, remark: 'Excellent' },
    { minScore: 75, maxScore: 79, grade: 'A-', points: 11, remark: 'Very Good' },
    { minScore: 70, maxScore: 74, grade: 'B+', points: 10, remark: 'Good' },
    { minScore: 65, maxScore: 69, grade: 'B', points: 9, remark: 'Above Average' },
    { minScore: 60, maxScore: 64, grade: 'B-', points: 8, remark: 'Average' },
    { minScore: 55, maxScore: 59, grade: 'C+', points: 7, remark: 'Satisfactory' },
    { minScore: 50, maxScore: 54, grade: 'C', points: 6, remark: 'Acceptable' },
    { minScore: 45, maxScore: 49, grade: 'C-', points: 5, remark: 'Below Average' },
    { minScore: 40, maxScore: 44, grade: 'D+', points: 4, remark: 'Poor' },
    { minScore: 35, maxScore: 39, grade: 'D', points: 3, remark: 'Very Poor' },
    { minScore: 30, maxScore: 34, grade: 'D-', points: 2, remark: 'Weak' },
    { minScore: 0, maxScore: 29, grade: 'E', points: 1, remark: 'Fail' },
  ];

  for (const grade of gradeScales) {
    await prisma.gradeScale.upsert({
      where: { id: grade.grade },
      update: {},
      create: grade,
    });
  }

  console.log('Grade scales seeded!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());