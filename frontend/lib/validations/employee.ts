import { z } from "zod"

export const employeeSchema = z.object({
  employeeId: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  fatherName: z.string().min(2, "Father name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits"),
  aadhaarNumber: z.string().min(12, "Aadhaar number must be at least 12 digits").max(12, "Aadhaar number must be 12 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  photoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
