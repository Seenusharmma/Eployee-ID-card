"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Upload, FileText, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmployeeTable } from "@/components/shared/employee-table"
import IdCard from "@/components/shared/id-card"
import { getEmployees, deleteEmployee, createEmployee } from "@/lib/storage"
import { toast } from "sonner"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"

export default function EmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)

  async function fetchEmployees() {
    setLoading(true)
    const data = await getEmployees({ search, department: departmentFilter })
    setEmployees(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchEmployees()
  }, [search, departmentFilter])

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this employee?")) return
    const ok = await deleteEmployee(id)
    if (ok) {
      toast.success("Employee deleted")
      fetchEmployees()
    } else {
      toast.error("Failed to delete")
    }
  }

  function normalizeDate(value: string): string {
    const v = value.trim()
    if (!v) return ""
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
    const m = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
    if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`
    return v
  }

  async function handleBulkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (evt) => {
      const text = evt.target?.result as string
      const rows = text.split("\n").slice(1)
      let success = 0

      for (const row of rows) {
        const cols = row.split(",")
        if (cols.length < 13) continue

        const emp = {
          employeeId: cols[0]?.trim(),
          name: cols[1]?.trim(),
          fatherName: cols[2]?.trim(),
          contactNumber: cols[3]?.trim(),
          email: cols[4]?.trim(),
          bloodGroup: cols[5]?.trim(),
          dateOfBirth: normalizeDate(cols[6]?.trim() || ""),
          dateOfJoining: normalizeDate(cols[7]?.trim() || ""),
          department: cols[8]?.trim(),
          designation: cols[9]?.trim(),
          emergencyContact: cols[10]?.trim(),
          aadhaarNumber: cols[11]?.trim(),
          address: cols[12]?.trim(),
          photoUrl: "",
          signatureUrl: "",
        }

        if (!emp.employeeId) continue

        try {
          await createEmployee(emp as any)
          success++
        } catch { }
      }

      toast.success(`${success} employees imported`)
      fetchEmployees()
    }
    reader.readAsText(file)
  }

  async function handleBulkGenerate() {
    if (selectedIds.length === 0) return
    setGenerating(true)
    const selected = employees.filter((e) => selectedIds.includes(e.employeeId))

    try {
      const pdf = new jsPDF("p", "mm", "a4")
      const pageW = 210

      for (let i = 0; i < selected.length; i++) {
        const div = document.createElement("div")
        div.style.position = "absolute"
        div.style.left = "-9999px"
        div.style.top = "0"
        div.style.width = "320px"
        div.style.padding = "0"
        div.style.backgroundColor = "#ffffff"
        document.body.appendChild(div)

        const { renderToString } = await import("react-dom/server")
        const { default: React } = await import("react")
        div.innerHTML = renderToString(
          React.createElement(IdCard, { employee: selected[i] })
        )

        await new Promise((r) => setTimeout(r, 100))

        const dataUrl = await toPng(div, { quality: 1, pixelRatio: 2 })

        document.body.removeChild(div)

        const img = new Image()
        img.src = dataUrl
        await img.decode()
        const imgH = (img.height * pageW) / img.width

        if (i > 0) pdf.addPage()
        pdf.addImage(dataUrl, "PNG", 0, 0, pageW, imgH)
      }

      pdf.save("employee-id-cards.pdf")
      toast.success(`${selected.length} ID card(s) generated`)
    } catch {
      toast.error("Failed to generate ID cards")
    }

    setGenerating(false)
  }

  function handleDownloadSample() {
    const headers = "employeeId,name,fatherName,contactNumber,email,bloodGroup,dateOfBirth,dateOfJoining,department,designation,emergencyContact,aadhaarNumber,address"
    const rows = [
      "LGM-KT-050,Jane Smith,Robert Smith,9876543210,jane@example.com,B+,1992-05-20,2024-06-01,Kitchen,Head Chef,9123456780,123456789012,456 Oak Ave",
      "LGM-KT-051,Mike Johnson,Tom Johnson,8765432109,mike@example.com,O+,1988-11-03,2023-09-15,Operations,Floor Manager,9988776655,987654321098,789 Pine Rd",
    ]
    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "employee-sample.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#7A003C]">
            Employees
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all employees
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkGenerate}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Generate ID Cards ({selectedIds.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSample}
          >
            <Download className="mr-2 h-4 w-4" />
            Sample CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("csv-upload")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleBulkUpload}
          />
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#7A003C] to-[#C9A15D] text-white hover:from-[#6a0032] hover:to-[#b8914d]"
            onClick={() => router.push("/dashboard/employees/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <EmployeeTable
          employees={employees}
          loading={loading}
          search={search}
          setSearch={setSearch}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </motion.div>
    </div>
  )
}
