'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [year, setYear] = useState(new Date().getFullYear());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
  };

  const fetchResults = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/results?classId=${selectedClass}&term=${term}&year=${year}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Class Results</h1>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                className="p-2 border rounded"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                className="p-2 border rounded"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
              </select>

              <input
                type="number"
                className="p-2 border rounded"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
            </div>

            <button
              onClick={fetchResults}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Loading...' : 'Generate Results'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.studentId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.admissionNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.totalMarks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.averageScore.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{result.overallGrade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}