import "./globals.css";

export const metadata = {
  title: "barcode-generator-project",
  description: "Generatore di barcode",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
