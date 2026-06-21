export interface EmployeeData {
  _id?: string
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
  status: "active" | "inactive"
  createdAt: string
}

const BASE = "/api"

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function initStorage() {
  await api("/seed", { method: "POST" })
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return true
  } catch {
    return false
  }
}

export async function logout() {
  await api("/auth/logout", { method: "POST" })
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const res = await api<{ authenticated: boolean }>("/auth/me")
    return res.authenticated
  } catch {
    return false
  }
}

export async function getEmployees(params?: {
  search?: string
  department?: string
  status?: string
}): Promise<EmployeeData[]> {
  const qs = new URLSearchParams()
  if (params?.search) qs.set("search", params.search)
  if (params?.department && params.department !== "all") qs.set("department", params.department)
  if (params?.status) qs.set("status", params.status)
  const q = qs.toString()
  return api<EmployeeData[]>(`/employees${q ? `?${q}` : ""}`)
}

export async function getEmployee(id: string): Promise<EmployeeData | null> {
  try {
    return await api<EmployeeData>(`/employees/${encodeURIComponent(id)}`)
  } catch {
    return null
  }
}

export async function createEmployee(
  data: Omit<EmployeeData, "status" | "createdAt" | "_id"> & { employeeId?: string }
): Promise<EmployeeData> {
  return api<EmployeeData>("/employees", {
    method: "POST",
    body: JSON.stringify({ ...data, status: "active" }),
  })
}

export async function updateEmployee(
  id: string,
  data: Partial<EmployeeData>
): Promise<EmployeeData | null> {
  try {
    return await api<EmployeeData>(`/employees/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch {
    return null
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    await api(`/employees/${encodeURIComponent(id)}`, { method: "DELETE" })
    return true
  } catch {
    return false
  }
}

export async function getDepartments(): Promise<string[]> {
  const res = await api<{ departments?: string[] }>("/settings")
  return res.departments ?? []
}

export async function addDepartment(name: string): Promise<string[]> {
  const res = await api<{ departments: string[] }>("/settings/departments", {
    method: "POST",
    body: JSON.stringify({ department: name }),
  })
  return res.departments
}

export async function removeDepartment(name: string): Promise<string[]> {
  const res = await api<{ departments: string[] }>("/settings/departments", {
    method: "DELETE",
    body: JSON.stringify({ department: name }),
  })
  return res.departments
}

export async function getDesignations(): Promise<string[]> {
  const res = await api<{ designations?: string[] }>("/settings")
  return res.designations ?? []
}

export async function addDesignation(name: string): Promise<string[]> {
  const res = await api<{ designations: string[] }>("/settings/designations", {
    method: "POST",
    body: JSON.stringify({ designation: name }),
  })
  return res.designations
}

export async function removeDesignation(name: string): Promise<string[]> {
  const res = await api<{ designations: string[] }>("/settings/designations", {
    method: "DELETE",
    body: JSON.stringify({ designation: name }),
  })
  return res.designations
}

export async function getSettings(): Promise<{ idPrefix: string }> {
  const res = await api<{ brandConfig?: { idPrefix: string }; idPrefix?: string }>("/settings")
  return res.brandConfig ?? { idPrefix: res.idPrefix ?? "LGM-KT" }
}

export async function updateSettings(settings: { idPrefix: string }) {
  await api("/settings", {
    method: "PUT",
    body: JSON.stringify({ brandConfig: settings }),
  })
}

export async function getStats(): Promise<{
  total: number
  active: number
  inactive: number
  departments: number
  withPhoto: number
  withSignature: number
  withBoth: number
  withNeither: number
}> {
  return api("/stats")
}
