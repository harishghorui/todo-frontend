export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1 style={{ textAlign: 'center', margin: '1rem 0' }}>Todo App</h1>
        </header>
        {children}
      </body>
    </html>
  );
}