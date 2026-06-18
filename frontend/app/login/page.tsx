"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff, Info } from "lucide-react"
import { loginSchema, LoginFormValues } from "@/lib/validations/employee"
import { initStorage, login } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"

const DEMO_EMAIL = "admin@legends.com"
const DEMO_PASSWORD = "admin123"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initStorage()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(data: LoginFormValues) {
    setLoading(true)
    const success = login(data.email, data.password)
    if (success) {
      toast.success("Login successful")
      router.push("/dashboard")
    } else {
      toast.error(`Invalid credentials. Try ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7A003C] via-[#4A001A] to-[#2a000d] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7A003C] to-[#C9A15D] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">LM</span>
              </div>
            </motion.div>
            <h1 className="text-2xl font-heading font-bold text-[#7A003C]">
              Legends Microbrewery
            </h1>
            <p className="text-xs tracking-[0.2em] text-[#C9A15D] uppercase font-medium">
              Kingdom of Brews
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Admin Login
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@legends.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="rounded-lg bg-muted p-3 border border-[#C9A15D]/30">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-[#C9A15D] mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p className="font-medium text-[#C9A15D]">Demo Credentials</p>
                    <p>Email: <code className="bg-background px-1 rounded">{DEMO_EMAIL}</code></p>
                    <p>Password: <code className="bg-background px-1 rounded">{DEMO_PASSWORD}</code></p>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#7A003C] to-[#C9A15D] hover:from-[#6a0032] hover:to-[#b8914d] text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
