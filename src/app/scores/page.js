'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';

export default function ScoresPage() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examScore, setExamScore] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [year, setYear] = useState(new Date().getFullYear());
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedStudent) {
      fetchScores();
    }
  }, [selectedStudent]);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const fetchStudentsByClass = async () => {
    setLoadingStudents(true);
    setStudents([]);
    setSelectedStudent('');
    
    try {
      const res = await fetch(`/api/students?classId=${selectedClass}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      if (data.length === 0) {
        toast.error('No students found in this class');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      toast.error('Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchScores = async () => {
    setLoadingScores(true);
    try {
      const res = await fetch(`/api/scores?studentId=${selectedStudent}`);
      const data = await res.json();
      setScores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setScores([]);
    } finally {
      setLoadingScores(false);
    }
  };

  // Kenya Grade Calculation Function
  const getKenyaGrade = (score) => {
    if (score >= 80) return { grade: 'A', points: 12, remark: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 75) return { grade: 'A-', points: 11, remark: 'Very Good', color: 'bg-green-50 text-green-700' };
    if (score >= 70) return { grade: 'B+', points: 10, remark: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 65) return { grade: 'B', points: 9, remark: 'Above Average', color: 'bg-blue-50 text-blue-700' };
    if (score >= 60) return { grade: 'B-', points: 8, remark: 'Average', color: 'bg-blue-50 text-blue-600' };
    if (score >= 55) return { grade: 'C+', points: 7, remark: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 50) return { grade: 'C', points: 6, remark: 'Acceptable', color: 'bg-yellow-50 text-yellow-700' };
    if (score >= 45) return { grade: 'C-', points: 5, remark: 'Below Average', color: 'bg-yellow-50 text-yellow-600' };
    if (score >= 40) return { grade: 'D+', points: 4, remark: 'Poor', color: 'bg-orange-100 text-orange-800' };
    if (score >= 35) return { grade: 'D', points: 3, remark: 'Very Poor', color: 'bg-orange-50 text-orange-700' };
    if (score >= 30) return { grade: 'D-', points: 2, remark: 'Weak', color: 'bg-orange-50 text-orange-600' };
    return { grade: 'E', points: 1, remark: 'Fail', color: 'bg-red-100 text-red-800' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedSubject) {
      toast.error('Please select student and subject');
      return;
    }

    const totalScore = parseFloat(examScore);
    if (totalScore < 0 || totalScore > 100) {
      toast.error('Score must be between 0 and 100');
      return;
    }

    setLoading(true);
    
    try {
      const kenyaGrade = getKenyaGrade(totalScore);
      
      const scoreData = {
        studentId: selectedStudent,
        subjectId: selectedSubject,
        examScore: totalScore,
        caScore: 0,
        term,
        year: parseInt(year)
      };

      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
      });

      if (res.ok) {
        toast.success(`Score saved! Grade: ${kenyaGrade.grade} (${kenyaGrade.remark})`);
        setExamScore('');
        fetchScores();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save score');
      }
    } catch (error) {
      toast.error('Failed to save score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Assessment Scores</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Score Entry Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Enter Scores</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Select Class</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Select Student</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    disabled={loadingStudents}
                  >
                    <option value="">Select Student</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.admissionNo})</option>
                    ))}
                  </select>
                  {loadingStudents && (
                    <div className="text-sm text-blue-600 mt-2">Loading students...</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Select Subject</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Exam Score (0-100)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={examScore}
                    onChange={(e) => setExamScore(e.target.value)}
                    required
                    min="0"
                    max="100"
                    placeholder="Enter score between 0-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Automatic grading based on Kenya system</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Term</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                    >
                      <option>Term 1</option>
                      <option>Term 2</option>
                      <option>Term 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Year</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Score'}
                </button>
              </form>
            </div>

            {/* Existing Scores Display */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Scores & Grades</h2>
              {selectedStudent ? (
                <div className="overflow-x-auto">
                  {loadingScores ? (
                    <div className="text-center py-8">
                      <div className="text-blue-600">Loading scores...</div>
                    </div>
                  ) : (
                    <>
                      {scores.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No scores recorded yet</p>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Score</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Grade</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Remark</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Term</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scores.map((score) => {
                              const gradeInfo = getKenyaGrade(score.examScore);
                              return (
                                <tr key={score.id} className="border-b">
                                  <td className="px-4 py-3 text-sm text-gray-800">{score.subject?.name || 'N/A'}</td>
                                  <td className="px-4 py-3 text-sm font-bold text-blue-600">{score.examScore}%</td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 rounded font-bold ${gradeInfo.color}`}>
                                      {gradeInfo.grade}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{gradeInfo.remark}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{score.term} {score.year}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Select a student to view scores</p>
              )}
            </div>
          </div>

          {/* Kenya Grading Scale Reference */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Kenya Grading Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-green-100 p-3 rounded-lg text-center"><span className="font-bold text-green-800">A</span><br /><span className="text-sm">80-100%</span><br /><span className="text-xs">Excellent</span></div>
              <div className="bg-green-50 p-3 rounded-lg text-center"><span className="font-bold text-green-700">A-</span><br /><span className="text-sm">75-79%</span><br /><span className="text-xs">Very Good</span></div>
              <div className="bg-blue-100 p-3 rounded-lg text-center"><span className="font-bold text-blue-800">B+</span><br /><span className="text-sm">70-74%</span><br /><span className="text-xs">Good</span></div>
              <div className="bg-blue-50 p-3 rounded-lg text-center"><span className="font-bold text-blue-700">B</span><br /><span className="text-sm">65-69%</span><br /><span className="text-xs">Above Avg</span></div>
              <div className="bg-yellow-100 p-3 rounded-lg text-center"><span className="font-bold text-yellow-800">C+</span><br /><span className="text-sm">55-59%</span><br /><span className="text-xs">Satisfactory</span></div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center"><span className="font-bold text-yellow-700">C</span><br /><span className="text-sm">50-54%</span><br /><span className="text-xs">Acceptable</span></div>
              <div className="bg-orange-100 p-3 rounded-lg text-center"><span className="font-bold text-orange-800">D+</span><br /><span className="text-sm">40-44%</span><br /><span className="text-xs">Poor</span></div>
              <div className="bg-red-100 p-3 rounded-lg text-center"><span className="font-bold text-red-800">E</span><br /><span className="text-sm">0-29%</span><br /><span className="text-xs">Fail</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}