"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Fingerprint, Eye, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PaymentAuthPage() {
  const [authStep, setAuthStep] = useState<"choose" | "scanning" | "success" | "error">("choose")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [authMethod, setAuthMethod] = useState<"fingerprint" | "face" | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get payment data from sessionStorage
    const storedPayment = sessionStorage.getItem("pendingPayment")
    if (storedPayment) {
      setPaymentData(JSON.parse(storedPayment))
    } else {
      // Redirect back if no payment data
      router.push("/dashboard/payment")
    }
  }, [router])

  const handleAuth = (method: "fingerprint" | "face") => {
    setAuthMethod(method)
    setAuthStep("scanning")

    // Simulate authentication process
    setTimeout(() => {
      // 90% success rate simulation
      const success = Math.random() > 0.1

      if (success) {
        setAuthStep("success")
        // Clear payment data and redirect after success
        setTimeout(() => {
          sessionStorage.removeItem("pendingPayment")
          router.push("/dashboard/payment/success")
        }, 2000)
      } else {
        setAuthStep("error")
      }
    }, 3000)
  }

  const retryAuth = () => {
    setAuthStep("choose")
    setAuthMethod(null)
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/payment">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Authentification Sécurisée</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Payment Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Récapitulatif du Paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bénéficiaire</span>
                  <span className="font-medium">{paymentData.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-medium text-lg text-[#E2211C]">{paymentData.amount} DZD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compte</span>
                  <span className="font-mono text-sm">{paymentData.accountNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Authentification Biométrique</CardTitle>
              <CardDescription>
                Choisissez votre méthode d'authentification préférée pour sécuriser ce paiement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authStep === "choose" && (
                <div className="space-y-6">
                  <Badge className="w-full justify-center bg-green-100 text-green-800 py-2">🔒 Paiement Sécurisé</Badge>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-32 flex-col space-y-3 hover:bg-red-50 hover:border-[#E2211C]"
                      onClick={() => handleAuth("fingerprint")}
                    >
                      <Fingerprint className="h-12 w-12 text-[#E2211C]" />
                      <div className="text-center">
                        <p className="font-medium">Empreinte</p>
                        <p className="text-xs text-gray-500">Digitale</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-32 flex-col space-y-3 hover:bg-red-50 hover:border-[#E2211C]"
                      onClick={() => handleAuth("face")}
                    >
                      <Eye className="h-12 w-12 text-[#E2211C]" />
                      <div className="text-center">
                        <p className="font-medium">Visage</p>
                        <p className="text-xs text-gray-500">Reconnaissance</p>
                      </div>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-500">
                    Votre authentification est protégée par un chiffrement de niveau bancaire
                  </p>
                </div>
              )}

              {authStep === "scanning" && (
                <div className="text-center py-8">
                  <div className="animate-pulse mb-6">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      {authMethod === "fingerprint" ? (
                        <Fingerprint className="h-12 w-12 text-[#E2211C]" />
                      ) : (
                        <Eye className="h-12 w-12 text-[#E2211C]" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentification en cours...</h3>
                  <p className="text-gray-600 mb-4">
                    {authMethod === "fingerprint" ? "Placez votre doigt sur le capteur" : "Regardez la caméra frontale"}
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-[#E2211C] h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                  </div>

                  <p className="text-sm text-gray-500">Analyse biométrique en cours...</p>
                </div>
              )}

              {authStep === "success" && (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>

                  <h3 className="text-lg font-semibold text-green-600 mb-2">Authentification Réussie !</h3>
                  <p className="text-gray-600 mb-4">Votre identité a été vérifiée avec succès</p>
                  <p className="text-sm text-gray-500">Traitement du paiement en cours...</p>
                </div>
              )}

              {authStep === "error" && (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                  </div>

                  <h3 className="text-lg font-semibold text-red-600 mb-2">Authentification Échouée</h3>
                  <p className="text-gray-600 mb-6">Impossible de vérifier votre identité. Veuillez réessayer.</p>

                  <div className="space-y-3">
                    <Button onClick={retryAuth} className="w-full">
                      Réessayer
                    </Button>
                    <Link href="/dashboard/payment">
                      <Button variant="outline" className="w-full">
                        Annuler le paiement
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
