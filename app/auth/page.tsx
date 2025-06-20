"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Fingerprint, Eye, Shield, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [biometricStep, setBiometricStep] = useState<"idle" | "scanning" | "success">("idle")
  const [authMethod, setAuthMethod] = useState<"password" | "biometric">("password")
  const router = useRouter()

  const handleBiometricAuth = async (type: "fingerprint" | "face") => {
    setIsLoading(true)
    setBiometricStep("scanning")

    // Simulate biometric authentication
    setTimeout(() => {
      setBiometricStep("success")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    }, 2000)
  }

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password authentication
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/satim-logo.png" alt="SATIM" width={48} height={48} className="rounded-lg" />
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-900">SATIM Pay</span>
              <p className="text-xs text-gray-600">
                Société d'Automatisation des Transactions Interbancaires et de Monétique
              </p>
            </div>
          </div>
          <p className="text-gray-600">Accédez à votre compte en toute sécurité</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>Choisissez votre méthode d'authentification préférée</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as "password" | "biometric")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Mot de passe
                </TabsTrigger>
                <TabsTrigger value="biometric" className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4" />
                  Biométrie
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-4">
                <form onSubmit={handlePasswordAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email ou Numéro de téléphone</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="exemple@email.com ou +213..."
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" type="password" placeholder="••••••••" required className="h-12" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-600">Se souvenir de moi</span>
                    </label>
                    <a href="#" className="text-red-600 hover:text-red-700">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="biometric" className="space-y-6">
                <div className="text-center">
                  <Badge className="mb-4 bg-green-100 text-green-800">🔒 Authentification Sécurisée</Badge>
                  <p className="text-gray-600 mb-6">
                    Utilisez votre empreinte digitale ou reconnaissance faciale pour vous connecter
                  </p>
                </div>

                {biometricStep === "idle" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex-col space-y-2 hover:bg-red-50"
                      onClick={() => handleBiometricAuth("fingerprint")}
                      disabled={isLoading}
                    >
                      <Fingerprint className="h-8 w-8 text-red-600" />
                      <span>Empreinte</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex-col space-y-2 hover:bg-red-50"
                      onClick={() => handleBiometricAuth("face")}
                      disabled={isLoading}
                    >
                      <Eye className="h-8 w-8 text-red-600" />
                      <span>Visage</span>
                    </Button>
                  </div>
                )}

                {biometricStep === "scanning" && (
                  <div className="text-center py-8">
                    <div className="animate-pulse mb-4">
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <Fingerprint className="h-10 w-10 text-red-600" />
                      </div>
                    </div>
                    <p className="text-gray-600">Authentification en cours...</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                )}

                {biometricStep === "success" && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-green-600 font-semibold">Authentification réussie !</p>
                    <p className="text-gray-600 text-sm">Redirection en cours...</p>
                  </div>
                )}

                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setAuthMethod("password")}
                    className="text-red-600 hover:text-red-700"
                  >
                    Utiliser le mot de passe à la place
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Pas encore de compte ?{" "}
                <a href="#" className="text-red-600 hover:text-red-700 font-semibold">
                  Créer un compte
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Connexion sécurisée avec chiffrement SSL 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  )
}
