'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Ikonex Academy</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="inline-flex items-center px-3 pt-1 text-sm font-medium text-gray-900">
                Dashboard
              </Link>
              <Link href="/classes" className="inline-flex items-center px-3 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Classes
              </Link>
              <Link href="/students" className="inline-flex items-center px-3 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Students
              </Link>
              <Link href="/subjects" className="inline-flex items-center px-3 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Subjects
              </Link>
              <Link href="/scores" className="inline-flex items-center px-3 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Scores
              </Link>
              <Link href="/results" className="inline-flex items-center px-3 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}