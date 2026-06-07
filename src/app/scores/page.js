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
    fetchScores();
  }, [selectedStudent]);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
  };

  const fetchSubjects = async () => {
    const res = await fetch('/api/subjects');
    const data = await res.json();
    setSubjects(data);
  };

  const fetchStudentsByClass = async () => {
    const res = await fetch(`/api/students?classId=${selectedClass}`);
    const data = await res.json();
    setStudents(data);
  };

  const fetchScores = async () => {
    if (selectedStudent) {
      const res = await fetch(`/api/scores?studentId=${selectedStudent}`);
      const data = await res.json();
      setScores(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      toast.success('Scores saved successfully');
      setExamScore('');
      setCaScore('');
      fetchScores();
    } else {
      const error = await res.json();
      toast.error(error.error || 'Failed to save scores');
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Student Assessment Scores</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Entry Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Enter Scores</h2>
              <form onSubmit={handleSubmit}>
                <select className="w-full p-2 border rounded mb-2"
                  value={selectedClass} onChange={e => setSelectedClass(e.target.value)} required>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select className="w-full p-2 border rounded mb-2"
                  value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admissionNo})</option>)}
                </select>

                <select className="w-full p-2 border rounded mb-2"
                  value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} required>
                  <option value="">Select Subject</option>
                  {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>

                <input type="number" placeholder="Exam Score (0-100)" className="w-full p-2 border rounded mb-2"
                  value={examScore} onChange={e => setExamScore(e.target.value)} required min="0" max="100" />

                <input type="number" placeholder="Continuous Assessment (0-100)" className="w-full p-2 border rounded mb-2"
                  value={caScore} onChange={e => setCaScore(e.target.value)} required min="0" max="100" />

                <select className="w-full p-2 border rounded mb-2"
                  value={term} onChange={e => setTerm(e.target.value)}>
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>

                <input type="number" className="w-full p-2 border rounded mb-4"
                  value={year} onChange={e => setYear(e.target.value)} />

                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save Scores
                </button>
              </form>
            </div>

            {/* Existing Scores Display */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Student Scores</h2>
              {selectedStudent ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subject</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Exam</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">CA</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Term</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((score) => (
                        <tr key={score.id}>
                          <td className="px-4 py-2 text-sm">{score.subject?.name}</td>
                          <td className="px-4 py-2 text-sm">{score.examScore}</td>
                          <td className="px-4 py-2 text-sm">{score.caScore}</td>
                          <td className="px-4 py-2 text-sm font-bold">{score.examScore + score.caScore}</td>
                          <td className="px-4 py-2 text-sm">{score.term} {score.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {scores.length === 0 && <p className="text-center text-gray-500 py-4">No scores recorded yet</p>}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Select a student to view scores</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}