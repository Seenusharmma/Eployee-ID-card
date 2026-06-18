"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Building2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getDepartments,
  addDepartment,
  removeDepartment,
  getDesignations,
  addDesignation,
  removeDesignation,
  getSettings,
  updateSettings,
} from "@/lib/storage"
import { BRAND } from "@/lib/constants"
import { toast } from "sonner"

export default function SettingsPage() {
  const [departments, setDepartments] = useState<string[]>([])
  const [designations, setDesignations] = useState<string[]>([])
  const [newDept, setNewDept] = useState("")
  const [newDesig, setNewDesig] = useState("")
  const [prefix, setPrefix] = useState("LGM-KT")
  const [primaryColor, setPrimaryColor] = useState(BRAND.colors.maroon)
  const [accentColor, setAccentColor] = useState(BRAND.colors.gold)

  useEffect(() => {
    setDepartments(getDepartments())
    setDesignations(getDesignations())
    setPrefix(getSettings().idPrefix)
  }, [])

  function handleAddDepartment() {
    if (!newDept.trim()) return
    addDepartment(newDept.trim())
    setDepartments(getDepartments())
    setNewDept("")
    toast.success("Department added")
  }

  function handleRemoveDepartment(name: string) {
    removeDepartment(name)
    setDepartments(getDepartments())
    toast.success("Department removed")
  }

  function handleAddDesignation() {
    if (!newDesig.trim()) return
    addDesignation(newDesig.trim())
    setDesignations(getDesignations())
    setNewDesig("")
    toast.success("Designation added")
  }

  function handleRemoveDesignation(name: string) {
    removeDesignation(name)
    setDesignations(getDesignations())
    toast.success("Designation removed")
  }

  function handleSavePrefix() {
    updateSettings({ idPrefix: prefix })
    toast.success("Prefix updated")
  }

  function removeDepartment(name: string) {
    setDepartments(departments.filter((d) => d !== name))
    toast.success("Department removed")
  }



  function removeDesignation(name: string) {
    setDesignations(designations.filter((d) => d !== name))
    toast.success("Designation removed")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#7A003C]">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your ID card system configuration
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading text-[#7A003C]">
              ID Card Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Employee ID Prefix</Label>
                <div className="flex gap-2">
                  <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                  <Button variant="outline" size="icon" onClick={handleSavePrefix}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: {prefix}-001
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading text-[#7A003C]">
              Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary (Maroon)</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent (Gold)</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Button className="mt-4" variant="outline" size="sm" onClick={() => toast.success("Colors saved")}>
              <Save className="mr-2 h-4 w-4" />
              Save Colors
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading text-[#7A003C]">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Manage Departments
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
                <Input
                  placeholder="New department name"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDepartment()}
                />
                <Button onClick={handleAddDepartment} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <motion.div
                  key={dept}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full text-sm"
                >
                  {dept}
                  <button
                    onClick={() => handleRemoveDepartment(dept)}
                    className="text-muted-foreground hover:text-destructive ml-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading text-[#7A003C]">
              Manage Designations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
                <Input
                  placeholder="New designation"
                  value={newDesig}
                  onChange={(e) => setNewDesig(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDesignation()}
                />
                <Button onClick={handleAddDesignation} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {designations.map((desig) => (
                <motion.div
                  key={desig}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full text-sm"
                >
                  {desig}
                  <button
                    onClick={() => handleRemoveDesignation(desig)}
                    className="text-muted-foreground hover:text-destructive ml-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
