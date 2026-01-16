"use client"

import { SpotifyLogo } from "@/components/spotify-logo"
import { t, type Language } from "@/lib/translations"

interface SpotifyHeaderProps {
  language?: Language
}

export function SpotifyHeader({ language = "en" }: SpotifyHeaderProps) {
  return (
    <header className="w-full bg-[#121212] border-b border-[#282828] py-4 sm:py-6 px-4 sm:px-8">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo and Renew - Always visible */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SpotifyLogo className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-white font-bold text-sm sm:text-base hidden sm:inline">{t("header.renew", language)}</span>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden sm:flex items-center gap-8">
          <a href="#" className="text-[#a7a7a7] hover:text-white text-sm font-bold transition-colors">
            {t("header.premium", language)}
          </a>
          <a href="#" className="text-[#a7a7a7] hover:text-white text-sm font-bold transition-colors">
            {t("header.assistance", language)}
          </a>
          <a href="#" className="text-[#a7a7a7] hover:text-white text-sm font-bold transition-colors">
            {t("header.download", language)}
          </a>
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-[#282828]">
            <a href="#" className="text-[#a7a7a7] hover:text-white text-sm font-bold transition-colors">
              {t("header.profile", language)}
            </a>
          </div>
        </nav>

        {/* Mobile Profile - Only visible on mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-white font-bold text-xs">{t("header.profile", language)}</span>
        </div>
      </div>
    </header>
  )
}
