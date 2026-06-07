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
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
      if (data.length === 0) {
        toast.error('No classes found. Please create a class first.');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
      toast.error('Failed to load classes');
    } finally {
      setLoadingClasses(false);
    }
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
      setResults(Array.isArray(data) ? data : []);
      if (data.length === 0) {
        toast.info('No results found for this class. Enter scores first.');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to fetch results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Get grade color for display
  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-50 text-green-700',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-50 text-blue-700',
      'B-': 'bg-blue-50 text-blue-600',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-50 text-yellow-700',
      'C-': 'bg-yellow-50 text-yellow-600',
      'D+': 'bg-orange-100 text-orange-800',
      'D': 'bg-orange-50 text-orange-700',
      'D-': 'bg-orange-50 text-orange-600',
      'E': 'bg-red-100 text-red-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Class Results & Rankings</h1>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Class</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={loadingClasses}
                >
                  <option value="">-- Select Class --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
                {loadingClasses && (
                  <div className="text-sm text-blue-600 mt-2">⏳ Loading classes...</div>
                )}
                {!loadingClasses && classes.length === 0 && (
                  <div className="text-sm text-red-600 mt-2">⚠️ No classes found. Create a class first.</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Term</label>
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
                  onChange={(e) => setYear(parseInt(e.target.value))}
                />
              </div>
            </div>

            <button
              onClick={fetchResults}
              disabled={loading || !selectedClass}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? '⏳ Generating...' : '📊 Generate Results'}
            </button>
          </div>

          {loading && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Generating results and rankings...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <h2 className="text-xl font-bold text-white">Class Performance Summary</h2>
                <p className="text-blue-100">Term: {term} | Year: {year}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result, idx) => (
                      <tr key={result.studentId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            result.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                            result.position === 2 ? 'bg-gray-100 text-gray-800' :
                            result.position === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {result.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.admissionNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.totalMarks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.averageScore.toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-sm font-bold ${getGradeColor(result.overallGrade)}`}>
                            {result.overallGrade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.totalPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && !loadingClasses && selectedClass && results.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-600">No scores have been recorded for this class yet.</p>
              <a href="/scores" className="inline-block mt-4 text-blue-600 hover:text-blue-800">Go to Scores Page →</a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}