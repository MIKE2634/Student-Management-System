'use client';

import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { Users, GraduationCap, BookOpen, FileText, PlusCircle, TrendingUp, Award } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    subjects: 0,
    scores: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [students, classes, subjects, scores] = await Promise.all([
        fetch('/api/students').then(res => res.json()),
        fetch('/api/classes').then(res => res.json()),
        fetch('/api/subjects').then(res => res.json()),
        fetch('/api/scores').then(res => res.json())
      ]);
      
      setStats({
        students: students.length || 0,
        classes: classes.length || 0,
        subjects: subjects.length || 0,
        scores: scores.length || 0
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: Users, color: 'from-blue-500 to-blue-600', borderColor: 'blue-500', bgGradient: 'from-blue-50 to-blue-100' },
    { title: 'Class Streams', value: stats.classes, icon: GraduationCap, color: 'from-green-500 to-green-600', borderColor: 'green-500', bgGradient: 'from-green-50 to-green-100' },
    { title: 'Subjects', value: stats.subjects, icon: BookOpen, color: 'from-purple-500 to-purple-600', borderColor: 'purple-500', bgGradient: 'from-purple-50 to-purple-100' },
    { title: 'Scores Recorded', value: stats.scores, icon: FileText, color: 'from-yellow-500 to-yellow-600', borderColor: 'yellow-500', bgGradient: 'from-yellow-50 to-yellow-100' },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
                <p className="text-blue-100">Manage your students, classes, and results all in one place</p>
              </div>
              <Award className="h-16 w-16 text-white/20" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-b-4 border-${stat.borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <PlusCircle className="h-6 w-6 text-blue-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/students" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center px-6 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg">
                📝 Register New Student
              </a>
              <a href="/classes" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center px-6 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg">
                🏫 Create Class Stream
              </a>
              <a href="/scores" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-center px-6 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg">
                ✏️ Enter Student Scores
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© 2024 Ikonex Academy Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}