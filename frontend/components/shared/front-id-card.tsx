"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"

interface FrontIDCardProps {
  preview?: boolean
}

const BRAND_ADDRESS = "Balagere Road, Varthur, Bengaluru - 560087"
const BRAND_CONTACT = "+91 98765 43210"

const TERMS = [
  "This ID Card is the property of Legends Microbrewery and must be carried by the employee at all times during working hours.",
  "The ID Card must be presented upon request by management, security personnel, or authorized representatives of the company.",
  "This card is strictly non-transferable and may only be used by the employee whose name and photograph appear on it.",
  "Any misuse, alteration, duplication, or unauthorized use of this ID Card may result in disciplinary action, including termination of employment.",
  "Employees must immediately report the loss, theft, or damage of the ID Card to the HR or Administration Department.",
  "The employee is responsible for maintaining the ID Card in good condition. Replacement charges may apply for lost or damaged cards.",
  "Possession of this ID Card does not guarantee continued employment and remains subject to company policies and regulations.",
  "Upon resignation, termination, retirement, or cessation of employment, the ID Card must be returned to the company immediately.",
  "Employees must comply with all company rules, safety guidelines, workplace conduct standards, and security procedures while on company premises.",
  "The company reserves the right to revoke, replace, or modify this ID Card and its associated privileges at any time.",
  "Unauthorized access to restricted areas using this card is strictly prohibited and may result in disciplinary and legal action.",
  "The holder agrees to abide by all policies, procedures, and code of conduct established by Legends Microbrewery.",
]

const FrontIDCard = forwardRef<HTMLDivElement, FrontIDCardProps>(
  ({ preview = false }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={preview ? false : { opacity: 0, scale: 0.95 }}
        animate={preview ? {} : { opacity: 1, scale: 1 }}
        className="rounded-xl overflow-hidden bg-white w-[320px] h-[540px] mx-auto shadow-xl flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Top decorative bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#7A003C] via-[#C9A15D] to-[#7A003C]" />

        {/* Header with Logo centered */}
        <div
          className="px-6 pt-6 pb-5 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, #7A003C 0%, #4A001A 100%)" }}
        >
          <div className="absolute top-2 left-2 w-8 h-8 border-l border-t border-[#C9A15D]/30 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-8 h-8 border-r border-t border-[#C9A15D]/30 rounded-tr-lg" />

          <div className="flex flex-col items-center gap-2 mb-1">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Legends Microbrewery"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h1
                className="text-sm font-bold tracking-tight text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Legends Microbrewery
              </h1>
            </div>
          </div>
          <p className="text-[8px] tracking-[0.3em] font-medium text-[#C9A15D]">
            KINGDOM OF BREWS
          </p>                                                                                                                                                                                                
        </div>
        
        {/* Terms & Conditions - Center */}
        <div className="px-4 flex-1">
          <p className="text-[9px] font-bold text-[#7A003C] uppercase tracking-wider text-center mb-2 mt-4">
            Terms &amp; Conditions
          </p>
          <div className="bg-[#F7EFE8]/40 rounded-lg border border-[#C9A15D]/20">
            <div className="px-3 py-2 space-y-1">
              {TERMS.map((term, i) => (
                <div key={i} className="flex gap-1.5">
                  <span className="text-[#C9A15D] text-[6px] font-bold mt-[2px] shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[6.5px] text-gray-500 leading-snug">{term}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Details - Bottom */}
        <div className="px-6 pb-3 space-y-2 mt-3">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#7A003C]/10 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-[#7A003C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[8px] font-semibold text-[#7A003C] uppercase tracking-wider">Address</p>
              <p className="text-[9px] text-gray-600 leading-relaxed">{BRAND_ADDRESS}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#7A003C]/10 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-[#7A003C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-[8px] font-semibold text-[#7A003C] uppercase tracking-wider">Contact</p>
              <p className="text-[9px] text-gray-600">{BRAND_CONTACT}</p>
            </div>
          </div>
        </div>

        <div className="h-2" />

        {/* Bottom decorative bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#C9A15D] via-[#7A003C] to-[#C9A15D]" />
      </motion.div>
    )
  }
)

FrontIDCard.displayName = "FrontIDCard"
export default FrontIDCard
