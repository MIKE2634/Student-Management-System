'use client';

import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    totalScores: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const students = await fetch('/api/students').then(res => res.json());
      const classes = await fetch('/api/classes').then(res => res.json());
      const subjects = await fetch('/api/subjects').then(res => res.json());
      const scores = await fetch('/api/scores').then(res => res.json());

      setStats({
        totalStudents: Array.isArray(students) ? students.length : 0,
        totalClasses: Array.isArray(classes) ? classes.length : 0,
        totalSubjects: Array.isArray(subjects) ? subjects.length : 0,
        totalScores: Array.isArray(scores) ? scores.length : 0
      });
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h2>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-blue-600">{stats.totalStudents}</div>
                <div className="text-gray-600">Total Students</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-green-600">{stats.totalClasses}</div>
                <div className="text-gray-600">Class Streams</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-purple-600">{stats.totalSubjects}</div>
                <div className="text-gray-600">Subjects</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-yellow-600">{stats.totalScores}</div>
                <div className="text-gray-600">Scores Recorded</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}