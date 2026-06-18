"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, Upload } from "lucide-react"
import { employeeSchema, EmployeeFormValues } from "@/lib/validations/employee"
import { DEPARTMENTS, BLOOD_GROUPS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface EmployeeFormProps {
  defaultValues?: Partial<EmployeeFormValues>
  onSubmit: (data: EmployeeFormValues) => Promise<void>
  loading: boolean
  submitLabel: string
  onValuesChange?: (values: EmployeeFormValues) => void
}

export function EmployeeForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel,
  onValuesChange,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      fatherName: "",
      contactNumber: "",
      email: "",
      bloodGroup: "",
      dateOfBirth: "",
      dateOfJoining: "",
      department: "",
      designation: "",
      emergencyContact: "",
      address: "",
      photoUrl: "",
      signatureUrl: "",
      ...defaultValues,
    },
  })

  const values = watch()
  const photoUrl = watch("photoUrl")
  const signatureUrl = watch("signatureUrl")

  function notifyChange() {
    if (onValuesChange) {
      const currentValues = watch()
      onValuesChange(currentValues as EmployeeFormValues)
    }
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const url = evt.target?.result as string
      setValue("photoUrl", url)
      notifyChange()
    }
    reader.readAsDataURL(file)
  }

  function handleSignatureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const url = evt.target?.result as string
      setValue("signatureUrl", url)
      notifyChange()
    }
    reader.readAsDataURL(file)
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data)
      })}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            placeholder="LGM-KT-001 (leave blank to auto-generate)"
            {...register("employeeId", { onChange: notifyChange })}
          />
          <p className="text-xs text-muted-foreground">Leave empty for auto-generated ID</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Employee Name *</Label>
          <Input
            id="name"
            {...register("name", { onChange: notifyChange })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherName">Father&apos;s Name *</Label>
          <Input
            id="fatherName"
            {...register("fatherName", { onChange: notifyChange })}
            className={errors.fatherName ? "border-destructive" : ""}
          />
          {errors.fatherName && (
            <p className="text-xs text-destructive">
              {errors.fatherName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            {...register("contactNumber", { onChange: notifyChange })}
            className={errors.contactNumber ? "border-destructive" : ""}
          />
          {errors.contactNumber && (
            <p className="text-xs text-destructive">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { onChange: notifyChange })}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group *</Label>
          <Select
            value={values.bloodGroup}
            onValueChange={(v) => {
              if (v) setValue("bloodGroup", v)
              notifyChange()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bloodGroup && (
            <p className="text-xs text-destructive">
              {errors.bloodGroup.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date Of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth", { onChange: notifyChange })}
            className={errors.dateOfBirth ? "border-destructive" : ""}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfJoining">Date Of Joining *</Label>
          <Input
            id="dateOfJoining"
            type="date"
            {...register("dateOfJoining", { onChange: notifyChange })}
            className={errors.dateOfJoining ? "border-destructive" : ""}
          />
          {errors.dateOfJoining && (
            <p className="text-xs text-destructive">
              {errors.dateOfJoining.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={values.department}
            onValueChange={(v) => {
              if (v) setValue("department", v)
              notifyChange()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-xs text-destructive">
              {errors.department.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            id="designation"
            placeholder="e.g. Head Brewer"
            {...register("designation", { onChange: notifyChange })}
            className={errors.designation ? "border-destructive" : ""}
          />
          {errors.designation && (
            <p className="text-xs text-destructive">
              {errors.designation.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency Contact *</Label>
          <Input
            id="emergencyContact"
            {...register("emergencyContact", { onChange: notifyChange })}
            className={errors.emergencyContact ? "border-destructive" : ""}
          />
          {errors.emergencyContact && (
            <p className="text-xs text-destructive">
              {errors.emergencyContact.message}
            </p>
          )}
        </div>
      </motion.div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          rows={3}
          {...register("address", { onChange: notifyChange })}
          className={errors.address ? "border-destructive" : ""}
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Employee Photo</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("photo-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            {photoUrl && (
              <div className="w-10 h-10 rounded-full overflow-hidden border">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Department Signature</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("sig-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Signature
            </Button>
            <input
              id="sig-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSignatureUpload}
            />
            {signatureUrl && (
              <div className="w-16 h-8 overflow-hidden border rounded">
                <img
                  src={signatureUrl}
                  alt="Signature"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#7A003C] to-[#C9A15D] hover:from-[#6a0032] hover:to-[#b8914d] text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}
