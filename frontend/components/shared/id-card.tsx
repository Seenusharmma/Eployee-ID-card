"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"

interface EmployeeData {
  employeeId: string
  name: string
  fatherName: string
  contactNumber: string
  email: string
  bloodGroup: string
  dateOfBirth: string
  dateOfJoining: string
  department: string
  designation: string
  emergencyContact: string
  aadhaarNumber: string
  address: string
  photoUrl: string
  signatureUrl: string
  status: string
}

interface IDCardProps {
  employee: EmployeeData
  preview?: boolean
}

function safeDate(value: string) {
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : d.toLocaleDateString("en-IN")
}

const IDCard = forwardRef<HTMLDivElement, IDCardProps>(
  ({ employee, preview = false }, ref) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const profileUrl = `${baseUrl}/profile/${employee.employeeId}`

    return (
      <motion.div
        ref={ref}
        initial={preview ? false : { opacity: 0, scale: 0.95 }}
        animate={preview ? {} : { opacity: 1, scale: 1 }}
        className="id-card-shadow rounded-xl overflow-hidden bg-white w-[320px] h-[540px] mx-auto flex flex-col justify-between"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="bg-white px-5 pt-6 pb-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            
            <div>
              <h1
                className="text-base font-bold tracking-tight"
                style={{ color: "#7A003C", fontFamily: "'Playfair Display', serif" }}
              >
                Legends Microbrewery
              </h1>
            </div>
          </div>
          <p
            className="text-[9px] tracking-[0.25em] font-medium"
            style={{ color: "#C9A15D" }}
          >
            EMPLLOYEE ID 
          </p>
        </div>

        <div className="px-5 pb-3 flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#C9A15D] shadow-lg">
              {employee.photoUrl ? (
                <img
                  src={employee.photoUrl}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#7A003C] to-[#C9A15D] flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {employee.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <h2
            className="text-lg font-bold text-center leading-tight"
            style={{ color: "#7A003C", fontFamily: "'Playfair Display', serif" }}
          >
            {employee.name || "Full Name"}
          </h2>
          <p className="text-xs font-medium text-[#C9A15D] mb-3">
            {employee.designation || "Designation"}
          </p>

          <div className="w-full space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: "#7A003C" }}>
                Father&apos;s Name
              </span>
              <span className="text-gray-700">
                {employee.fatherName || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: "#7A003C" }}>
                Contact
              </span>
              <span className="text-gray-700">
                {employee.contactNumber || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: "#7A003C" }}>
                Blood Group
              </span>
              <span className="text-gray-700 font-medium">
                {employee.bloodGroup || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: "#7A003C" }}>
                DOB
              </span>
              <span className="text-gray-700">
                {employee.dateOfBirth ? safeDate(employee.dateOfBirth) : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: "#7A003C" }}>
                Department
              </span>
              <span className="text-gray-700">
                {employee.department || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: "#7A003C" }}>
                DOJ
              </span>
              <span className="text-gray-700">
                {employee.dateOfJoining ? safeDate(employee.dateOfJoining) : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: "#7A003C" }}>
                Emergency
              </span>
              <span className="text-gray-700">
                {employee.emergencyContact || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold" style={{ color: "#7A003C" }}>
                Aadhaar No.
              </span>
              <span className="text-gray-700 font-mono text-[10px]">
                {employee.aadhaarNumber || "—"}
              </span>
            </div>
          </div>
        </div>

        <div
          className="gradient-footer px-5 py-3 flex items-center justify-between"
          style={{ minHeight: "56px" }}
        >
          <div>
            <p className="text-[8px] text-white/70 uppercase tracking-wider">Employee ID</p>
            <p
              className="text-sm font-bold tracking-wider"
              style={{ color: "#C9A15D" }}
            >
              {employee.employeeId || "LGM-KT-000"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {employee.signatureUrl && (
              <div className="h-8 w-16 overflow-hidden">
                <img
                  src={employee.signatureUrl}
                  alt="Signature"
                  className="h-full w-full object-contain brightness-0 invert opacity-80"
                />
              </div>
            )}
            <div className="bg-white rounded p-0.5">
              <QRCodeSVG value={profileUrl} size={32} />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }
)

IDCard.displayName = "IDCard"
export default IDCard
