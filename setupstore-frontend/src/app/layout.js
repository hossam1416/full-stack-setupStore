import ClientLayout from "../components/ClientLayout";
import "./globals.css";

export const metadata = {
  title: "Setup Store",
  description: "Your ultimate PC building and hardware store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
