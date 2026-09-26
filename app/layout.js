import './globals.css';

export const metadata = {
  title: 'Trollrr',
  description: 'The restrictions are the feature.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
