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
  const [caScore, setCaScore] = useState('');
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
  const getKenyaGrade = (totalScore) => {
    if (totalScore >= 80) return { grade: 'A', points: 12, remark: 'Excellent' };
    if (totalScore >= 75) return { grade: 'A-', points: 11, remark: 'Very Good' };
    if (totalScore >= 70) return { grade: 'B+', points: 10, remark: 'Good' };
    if (totalScore >= 65) return { grade: 'B', points: 9, remark: 'Above Average' };
    if (totalScore >= 60) return { grade: 'B-', points: 8, remark: 'Average' };
    if (totalScore >= 55) return { grade: 'C+', points: 7, remark: 'Satisfactory' };
    if (totalScore >= 50) return { grade: 'C', points: 6, remark: 'Acceptable' };
    if (totalScore >= 45) return { grade: 'C-', points: 5, remark: 'Below Average' };
    if (totalScore >= 40) return { grade: 'D+', points: 4, remark: 'Poor' };
    if (totalScore >= 35) return { grade: 'D', points: 3, remark: 'Very Poor' };
    if (totalScore >= 30) return { grade: 'D-', points: 2, remark: 'Weak' };
    return { grade: 'E', points: 1, remark: 'Fail' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedSubject) {
      toast.error('Please select student and subject');
      return;
    }

    setLoading(true);
    
    try {
      const totalScore = parseFloat(examScore) + parseFloat(caScore);
      const kenyaGrade = getKenyaGrade(totalScore);
      
      const scoreData = {
        studentId: selectedStudent,
        subjectId: selectedSubject,
        examScore: parseFloat(examScore),
        caScore: parseFloat(caScore),
        term,
        year: parseInt(year)
      };

      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
      });

      if (res.ok) {
        toast.success(`Scores saved! Grade: ${kenyaGrade.grade} (${kenyaGrade.remark})`);
        setExamScore('');
        setCaScore('');
        fetchScores();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save scores');
      }
    } catch (error) {
      toast.error('Failed to save scores');
    } finally {
      setLoading(false);
    }
  };

  // Calculate grade for display
  const getDisplayGrade = (exam, ca) => {
    const total = (exam || 0) + (ca || 0);
    const grade = getKenyaGrade(total);
    return grade.grade;
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
                    <div className="text-sm text-blue-600 mt-2">⏳ Loading students...</div>
                  )}
                  {!loadingStudents && students.length === 0 && selectedClass && (
                    <div className="text-sm text-yellow-600 mt-2">⚠️ No students in this class. Register students first.</div>
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

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Exam Score (0-100)</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={examScore}
                      onChange={(e) => setExamScore(e.target.value)}
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">CA Score (0-100)</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={caScore}
                      onChange={(e) => setCaScore(e.target.value)}
                      required
                      min="0"
                      max="100"
                    />
                  </div>
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
                  {loading ? '💾 Saving...' : '💾 Save Scores'}
                </button>
              </form>
            </div>

            {/* Existing Scores Display */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Scores</h2>
              {selectedStudent ? (
                <div className="overflow-x-auto">
                  {loadingScores ? (
                    <div className="text-center py-8">
                      <div className="text-blue-600">⏳ Loading scores...</div>
                    </div>
                  ) : (
                    <>
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Exam</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">CA</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Grade</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Term</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scores.map((score) => (
                            <tr key={score.id} className="border-b">
                              <td className="px-4 py-3 text-sm text-gray-800">{score.subject?.name || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{score.examScore}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{score.caScore}</td>
                              <td className="px-4 py-3 text-sm font-bold text-blue-600">
                                {score.examScore + score.caScore}
                              </td>
                              <td className="px-4 py-3 text-sm font-bold">
                                <span className={`px-2 py-1 rounded ${
                                  getDisplayGrade(score.examScore, score.caScore) === 'A' ? 'bg-green-100 text-green-800' :
                                  getDisplayGrade(score.examScore, score.caScore) === 'A-' ? 'bg-green-50 text-green-700' :
                                  getDisplayGrade(score.examScore, score.caScore) === 'B+' ? 'bg-blue-100 text-blue-800' :
                                  getDisplayGrade(score.examScore, score.caScore) === 'B' ? 'bg-blue-50 text-blue-700' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {getDisplayGrade(score.examScore, score.caScore)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{score.term} {score.year}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {scores.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No scores recorded yet</p>
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">Kenya Grading Scale Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-green-100 p-3 rounded-lg text-center"><span className="font-bold text-green-800">A</span><br/><span className="text-sm">80-100%</span></div>
              <div className="bg-green-50 p-3 rounded-lg text-center"><span className="font-bold text-green-700">A-</span><br/><span className="text-sm">75-79%</span></div>
              <div className="bg-blue-100 p-3 rounded-lg text-center"><span className="font-bold text-blue-800">B+</span><br/><span className="text-sm">70-74%</span></div>
              <div className="bg-blue-50 p-3 rounded-lg text-center"><span className="font-bold text-blue-700">B</span><br/><span className="text-sm">65-69%</span></div>
              <div className="bg-blue-50 p-3 rounded-lg text-center"><span className="font-bold text-blue-600">B-</span><br/><span className="text-sm">60-64%</span></div>
              <div className="bg-yellow-100 p-3 rounded-lg text-center"><span className="font-bold text-yellow-800">C+</span><br/><span className="text-sm">55-59%</span></div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center"><span className="font-bold text-yellow-700">C</span><br/><span className="text-sm">50-54%</span></div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center"><span className="font-bold text-yellow-600">C-</span><br/><span className="text-sm">45-49%</span></div>
              <div className="bg-orange-100 p-3 rounded-lg text-center"><span className="font-bold text-orange-800">D+</span><br/><span className="text-sm">40-44%</span></div>
              <div className="bg-orange-50 p-3 rounded-lg text-center"><span className="font-bold text-orange-700">D</span><br/><span className="text-sm">35-39%</span></div>
              <div className="bg-orange-50 p-3 rounded-lg text-center"><span className="font-bold text-orange-600">D-</span><br/><span className="text-sm">30-34%</span></div>
              <div className="bg-red-100 p-3 rounded-lg text-center"><span className="font-bold text-red-800">E</span><br/><span className="text-sm">0-29%</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}