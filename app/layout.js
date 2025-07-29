import "./globals.css";

export const metadata = {
  title: "Arbitraj Bot",
  description: "Arbitraj bot ana sayfa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-gray-300 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
