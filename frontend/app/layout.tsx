import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Legends Microbrewery - Employee ID Card System",
  description: "Admin panel for managing employee ID cards at Legends Microbrewery",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
