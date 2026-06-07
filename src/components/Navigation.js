'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Classes', href: '/classes', icon: '📚' },
    { name: 'Students', href: '/students', icon: '👨‍🎓' },
    { name: 'Subjects', href: '/subjects', icon: '📖' },
    { name: 'Scores', href: '/scores', icon: '✏️' },
    { name: 'Results', href: '/results', icon: '📊' },
  ];

  // Function to check if link is active
  const isActive = (href) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-purple-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl mr-2">🏫</span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Ikonex Academy
              </h1>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
                      ${active 
                        ? 'bg-white/20 text-white shadow-md' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    {active && (
                      <span className="ml-1 text-xs">●</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
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
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all
                    ${active 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.name}
                  {active && (
                    <span className="ml-auto text-xs">●</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}