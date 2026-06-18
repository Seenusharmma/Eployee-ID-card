import mongoose, { Schema, model, models } from "mongoose"

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: "Admin" },
  },
  { timestamps: true }
)

export const Admin = models.Admin || model("Admin", AdminSchema)
