"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, ShieldCheck } from "lucide-react"
import { t, type Language } from "@/lib/translations"
// Removed SpotifyHeader and SpotifyFooter as per user request to only show on card page

interface CaptchaVerificationProps {
  onVerified: () => void
  language?: Language
}

function generateCaptchaCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function CaptchaVerification({ onVerified, language = "en" }: CaptchaVerificationProps) {
  const [captchaCode, setCaptchaCode] = useState("")
  const captchaCodeRef = useRef("")
  const [userInput, setUserInput] = useState(["", "", "", ""])
  const [error, setError] = useState(false)

  const updateCaptcha = () => {
    const newCode = generateCaptchaCode()
    setCaptchaCode(newCode)
    captchaCodeRef.current = newCode
  }

  useEffect(() => {
    updateCaptcha()
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newInput = [...userInput]
    newInput[index] = value.slice(-1)
    setUserInput(newInput)
    setError(false)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`captcha-input-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-verify when all digits are entered
    const fullCode = newInput.join("")
    if (fullCode.length === 4) {
      setTimeout(() => {
        if (fullCode === captchaCodeRef.current) {
          onVerified()
        } else {
          setError(true)
          setUserInput(["", "", "", ""])
          updateCaptcha()
          document.getElementById("captcha-input-0")?.focus()
        }
      }, 200)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !userInput[index] && index > 0) {
      const prevInput = document.getElementById(`captcha-input-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = () => {
    const fullCode = userInput.join("")
    if (fullCode === captchaCodeRef.current) {
      onVerified()
    } else {
      setError(true)
      setUserInput(["", "", "", ""])
      updateCaptcha()
      document.getElementById("captcha-input-0")?.focus()
    }
  }

  const refreshCode = () => {
    updateCaptcha()
    setUserInput(["", "", "", ""])
    setError(false)
    document.getElementById("captcha-input-0")?.focus()
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#121212]">
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-[400px] flex flex-col items-center px-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#1ed760]/10 flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-[#1ed760]" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2 text-center">{t("captcha.title", language)}</h1>
          <p className="text-[#a7a7a7] text-sm mb-8 text-center">{t("captcha.subtitle", language)}</p>

          {/* Captcha Display */}
          <div className="relative w-full mb-8">
            <div className="bg-gradient-to-br from-[#282828] to-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <div className="flex justify-center items-center gap-3">
                {captchaCode.split("").map((digit, index) => (
                  <div key={index} className="relative">
                    <span
                      className="text-4xl font-bold text-white block w-12 h-14 flex items-center justify-center bg-[#121212] rounded-lg border border-[#404040] select-none"
                      style={{
                        fontFamily: "monospace",
                        textShadow: "0 0 10px rgba(30, 215, 96, 0.3)",
                      }}
                    >
                      {digit}
                    </span>
                  </div>
                ))}
              </div>
              {/* Refresh button */}
              <button
                onClick={refreshCode}
                className="absolute top-3 right-3 p-2 text-[#a7a7a7] hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Generate new code"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex gap-3 mb-4">
            {userInput.map((digit, index) => (
              <input
                key={index}
                id={`captcha-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-14 h-14 text-center text-base sm:text-2xl font-bold bg-[#121212] rounded-lg border-2 text-white focus:outline-none transition-all ${
                  error ? "border-red-500 shake" : digit ? "border-[#1ed760]" : "border-[#404040] focus:border-[#1ed760]"
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center animate-pulse">
              {t("captcha.incorrect", language)}
            </p>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={userInput.some((d) => !d)}
            className="w-full h-12 bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.02] text-black font-bold rounded-full transition-all disabled:opacity-50 disabled:hover:scale-100 mt-2"
          >
            {t("captcha.verify", language)}
          </Button>

          {/* Help text */}
          <p className="mt-6 text-xs text-[#a7a7a7] text-center">{t("captcha.help", language)}</p>
        </div>
      </main>

    </div>
  )
}
