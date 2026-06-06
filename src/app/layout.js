import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Ikonex Academy',
  description: 'Student Management System',
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