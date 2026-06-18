"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer, Loader2, ImageDown, FileDown } from "lucide-react"
import Link from "next/link"
import jsPDF from "jspdf"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import IDCard from "@/components/shared/id-card"
import FrontIDCard from "@/components/shared/front-id-card"
import { getEmployee } from "@/lib/storage"
import { toast } from "sonner"

export default function IDCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    async function load() {
      if (!id) return
      const data = await getEmployee(id)
      if (!data) {
        toast.error("Employee not found")
        router.push("/dashboard/employees")
        return
      }
      setEmployee(data)
      setLoading(false)
    }
    load()
  }, [id, router])

  async function captureBothCards(): Promise<string> {
    const el = document.getElementById("card-capture")
    if (!el) throw new Error("Card element not found")
    return toPng(el, { quality: 1, pixelRatio: 2 })
  }

  async function downloadPNG() {
    if (!employee) return
    setDownloading(true)
    try {
      const dataUrl = await captureBothCards()
      const link = document.createElement("a")
      link.download = `ID-Card-${employee.employeeId}.png`
      link.href = dataUrl
      link.click()
      toast.success("ID Card downloaded as PNG")
    } catch (e) {
      console.error("PNG error:", e)
      toast.error("Failed to download PNG")
    } finally {
      setDownloading(false)
    }
  }

  async function downloadPDF() {
    if (!employee) return
    setDownloading(true)
    try {
      const dataUrl = await captureBothCards()
      const img = new Image()
      img.src = dataUrl
      await img.decode()
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [img.width, img.height] })
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height)
      pdf.save(`ID-Card-${employee.employeeId}.pdf`)
      toast.success("ID Card downloaded as PDF")
    } catch (e) {
      console.error("PDF error:", e)
      toast.error("Failed to download PDF")
    } finally {
      setDownloading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#7A003C]" />
      </div>
    )
  }

  if (!employee) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/employees/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#7A003C]">
              ID Card
            </h1>
            <p className="text-sm text-muted-foreground">
              {employee.name} &middot; {employee.employeeId}
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={downloadPNG} disabled={downloading}>
            <ImageDown className="mr-2 h-4 w-4" />
            PNG
          </Button>
          <Button variant="outline" size="sm" onClick={downloadPDF} disabled={downloading}>
            <FileDown className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#7A003C] to-[#C9A15D] text-white"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="flex justify-center py-8" id="card-print">
        <div id="card-capture" className="space-y-6">
          <div>
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wider mb-2 print:hidden">
              Front
            </p>
            <FrontIDCard />
          </div>
          <div>
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wider mb-2 print:hidden">
              Back
            </p>
            <IDCard employee={employee} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #card-print, #card-print * { visibility: visible; }
          #card-print { position: absolute; left: 50%; top: 10%; transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
