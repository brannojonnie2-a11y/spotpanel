"use client"

import { t, type Language } from "@/lib/translations"

interface SpotifyFooterProps {
  language?: Language
}

export function SpotifyFooter({ language = "en" }: SpotifyFooterProps) {
  return (
    <footer className="w-full bg-[#121212] border-t border-[#282828]">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {/* Company */}
          <div>
            <h4 className="text-[#a7a7a7] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">{t("footer.company", language)}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.about", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.jobOffers", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.forTheRecord", language)}
                </a>
              </li>
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h4 className="text-[#a7a7a7] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">{t("footer.communities", language)}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.artistsArea", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.developers", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.advertisingCampaigns", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.investors", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.suppliers", language)}
                </a>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-[#a7a7a7] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">{t("footer.usefulLinks", language)}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.assistance", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.webReader", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.freeMobileApp", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.importMusic", language)}
                </a>
              </li>
            </ul>
          </div>

          {/* Subscriptions Spotify */}
          <div>
            <h4 className="text-[#a7a7a7] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">{t("footer.subscriptions", language)}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.premiumStaff", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.premiumDuo", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.premiumFamily", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.premiumStudents", language)}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#a7a7a7] hover:text-white text-xs sm:text-sm transition-colors">
                  {t("footer.spotifyFree", language)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-xs text-[#a7a7a7] pt-8 sm:pt-12 border-t border-[#282828]">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.legal", language)}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.securityPrivacy", language)}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.dataProtection", language)}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.cookieSettings", language)}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.aboutPubs", language)}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.accessibility", language)}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
            </svg>
            <span>{t("footer.unitedStates", language)}</span>
          </div>
          <span>{t("footer.copyright", language)}</span>
        </div>
      </div>
    </footer>
  )
}
