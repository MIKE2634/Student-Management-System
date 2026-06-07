import './globals.css';

export const metadata = {
  title: 'Ikonex Academy',
  description: 'Student Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}