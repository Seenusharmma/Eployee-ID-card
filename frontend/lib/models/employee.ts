import mongoose, { Schema, model, models } from "mongoose"

const EmployeeSchema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fatherName: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    dateOfJoining: { type: String, default: "" },
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    aadhaarNumber: { type: String, default: "" },
    address: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    signatureUrl: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
)

export const Employee = models.Employee || model("Employee", EmployeeSchema)
