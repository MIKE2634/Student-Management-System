import './globals.css';

export const metadata = {
  title: 'Ikonex Academy - Student Management System',
  description: 'A modern student management system for Ikonex Academy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}