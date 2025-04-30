import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import FacebookPixel from "@/FacebookPixel"

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
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=613067405045316&ev=PageView&noscript=1" />
            `,
          }}
        />
              <FacebookPixel pixelId="3697590837205004" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
