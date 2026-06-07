'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Classes', href: '/classes', icon: '📚' },
    { name: 'Students', href: '/students', icon: '👨‍🎓' },
    { name: 'Subjects', href: '/subjects', icon: '📖' },
    { name: 'Scores', href: '/scores', icon: '✏️' },
    { name: 'Results', href: '/results', icon: '📊' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-purple-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl mr-2">🏫</span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Ikonex Academy
              </h1>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-900 to-purple-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:bg-white/10 block px-3 py-2 rounded-lg text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}