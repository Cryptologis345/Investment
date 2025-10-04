import { AuthProvider } from "@/components/context/AuthContext";
import "./globals.css";



export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
      
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
