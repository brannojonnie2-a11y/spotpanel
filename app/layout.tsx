import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"

const _figtree = Figtree({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Renew",
  description: "Renew your subscription.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
