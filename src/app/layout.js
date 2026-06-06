import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Ikonex Academy - Student Management System',
  description: 'Manage students, classes, subjects, and results',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}