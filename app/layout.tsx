import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Configure the Inter font without the Arabic subset
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "بطاقة كريبتو رقمية",
  description: "احصل على بطاقتك الرقمية الآن وابدأ التسوّق والدفع بكل سهولة",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
