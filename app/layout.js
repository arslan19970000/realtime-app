


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
          {/* This will be available on every page */}
        <main>{children}</main>  {/* Main content for each page */}
         {/* This will be available at the bottom of every page */}
         
      </body>
    </html>
  );
}
