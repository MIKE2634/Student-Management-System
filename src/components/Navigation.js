'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Classes', href: '/classes', icon: '📚' },
  { name: 'Students', href: '/students', icon: '👨‍🎓' },
  { name: 'Subjects', href: '/subjects', icon: '📖' },
  { name: 'Scores', href: '/scores', icon: '✏️' },
  { name: 'Results', href: '/results', icon: '📊' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Ikonex Academy</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-3 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-b-2 border-blue-500 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}