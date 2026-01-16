import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"
import { SessionTracker } from "@/components/session-tracker";

const _figtree = Figtree({ subsets: ["latin"] })

// SessionTracker is now a separate client component

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
        <SessionTracker />
        {children}
      </body>
    </html>
  )
}
