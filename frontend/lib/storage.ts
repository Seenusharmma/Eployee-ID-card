"use client"

export interface EmployeeData {
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
  address: string
  photoUrl: string
  signatureUrl: string
  status: "active" | "inactive"
  createdAt: string
}

export interface AdminData {
  email: string
  password: string
  name: string
}

const KEYS = {
  employees: "lg_employees",
  admin: "lg_admin",
  departments: "lg_departments",
  designations: "lg_designations",
  settings: "lg_settings",
  session: "lg_session",
}

const DEFAULT_ADMIN: AdminData = {
  email: "admin@legends.com",
  password: "admin123",
  name: "Admin",
}

const DEFAULT_DEPARTMENTS = [
  "Operations", "Kitchen", "House Keeping",
  "IT", "Maintenance", "Accounts",
]

const DEFAULT_DESIGNATIONS = [
  "Head Brewer", "Assistant Brewer", "Brewing Technician",
  "Quality Manager", "Quality Analyst", "Packaging Manager",
  "Packaging Operator", "Sales Manager", "Sales Executive",
  "Marketing Manager", "Finance Manager", "Accountant",
  "HR Manager", "HR Executive", "Logistics Manager",
  "Logistics Coordinator", "Maintenance Engineer",
  "Maintenance Technician", "Administrative Officer",
  "General Manager", "CEO", "F&B Manager", "Bartender", "Server",
]

const ID_PREFIX = "LGM-KT"

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error("Failed to write to localStorage")
  }
}

export function initStorage() {
  if (typeof window === "undefined") return

  setItem(KEYS.admin, DEFAULT_ADMIN)
  if (!localStorage.getItem(KEYS.departments)) {
    setItem(KEYS.departments, DEFAULT_DEPARTMENTS)
  }
  if (!localStorage.getItem(KEYS.designations)) {
    setItem(KEYS.designations, DEFAULT_DESIGNATIONS)
  }
  if (!localStorage.getItem(KEYS.employees)) {
    setItem(KEYS.employees, [])
  }
  if (!localStorage.getItem(KEYS.settings)) {
    setItem(KEYS.settings, { idPrefix: ID_PREFIX })
  }
}

export function login(email: string, password: string): boolean {
  const admin = getItem<AdminData | null>(KEYS.admin, null)
  if (admin && admin.email === email && admin.password === password) {
    setItem(KEYS.session, { email, name: admin.name, loggedInAt: new Date().toISOString() })
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(KEYS.session)
}

export function isLoggedIn(): boolean {
  return !!getItem<unknown>(KEYS.session, null)
}

export function getEmployees(): EmployeeData[] {
  return getItem<EmployeeData[]>(KEYS.employees, [])
}

export function getEmployee(id: string): EmployeeData | undefined {
  return getEmployees().find((e) => e.employeeId === id)
}

export function createEmployee(data: Omit<EmployeeData, "status" | "createdAt"> & { employeeId?: string }): EmployeeData {
  const employees = getEmployees()

  let employeeId = data.employeeId
  if (!employeeId) {
    const lastId = employees.length > 0
      ? parseInt(employees[employees.length - 1].employeeId.split("-")[2] || "0", 10)
      : 0
    const nextNum = lastId + 1
    employeeId = `${ID_PREFIX}-${String(nextNum).padStart(3, "0")}`
  }

  const exists = employees.find((e) => e.employeeId === employeeId)
  if (exists) throw new Error(`Employee ID ${employeeId} already exists`)

  const employee: EmployeeData = {
    name: data.name,
    fatherName: data.fatherName,
    contactNumber: data.contactNumber,
    email: data.email,
    bloodGroup: data.bloodGroup,
    dateOfBirth: data.dateOfBirth,
    dateOfJoining: data.dateOfJoining,
    department: data.department,
    designation: data.designation,
    emergencyContact: data.emergencyContact,
    address: data.address,
    photoUrl: data.photoUrl || "",
    signatureUrl: data.signatureUrl || "",
    employeeId,
    status: "active",
    createdAt: new Date().toISOString(),
  }

  setItem(KEYS.employees, [...employees, employee])
  return employee
}

export function updateEmployee(id: string, data: Partial<EmployeeData>): EmployeeData | undefined {
  const employees = getEmployees()
  const index = employees.findIndex((e) => e.employeeId === id)
  if (index === -1) return undefined

  const updated = { ...employees[index], ...data }
  employees[index] = updated
  setItem(KEYS.employees, employees)
  return updated
}

export function deleteEmployee(id: string): boolean {
  const employees = getEmployees()
  const filtered = employees.filter((e) => e.employeeId !== id)
  if (filtered.length === employees.length) return false
  setItem(KEYS.employees, filtered)
  return true
}

export function getDepartments(): string[] {
  return getItem<string[]>(KEYS.departments, DEFAULT_DEPARTMENTS)
}

export function addDepartment(name: string) {
  const depts = getDepartments()
  if (!depts.includes(name)) {
    setItem(KEYS.departments, [...depts, name])
  }
}

export function removeDepartment(name: string) {
  const depts = getDepartments()
  setItem(KEYS.departments, depts.filter((d) => d !== name))
}

export function getDesignations(): string[] {
  return getItem<string[]>(KEYS.designations, DEFAULT_DESIGNATIONS)
}

export function addDesignation(name: string) {
  const desigs = getDesignations()
  if (!desigs.includes(name)) {
    setItem(KEYS.designations, [...desigs, name])
  }
}

export function removeDesignation(name: string) {
  const desigs = getDesignations()
  setItem(KEYS.designations, desigs.filter((d) => d !== name))
}

export function getSettings() {
  return getItem<{ idPrefix: string }>(KEYS.settings, { idPrefix: ID_PREFIX })
}

export function updateSettings(settings: { idPrefix: string }) {
  setItem(KEYS.settings, settings)
}

export function getStats() {
  const employees = getEmployees()
  return {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    inactive: employees.filter((e) => e.status === "inactive").length,
    departments: new Set(employees.map((e) => e.department)).size,
  }
}

export function searchEmployees(query: string, department?: string) {
  let employees = getEmployees()

  if (query) {
    const q = query.toLowerCase()
    employees = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    )
  }

  if (department && department !== "all") {
    employees = employees.filter((e) => e.department === department)
  }

  return employees
}
