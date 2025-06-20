"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Users, Clock, CheckCircle, Fingerprint } from "lucide-react"
import Link from "next/link"

export default function TransferPage() {
  const [step, setStep] = useState<"form" | "confirm" | "auth" | "success">("form")
  const [transferData, setTransferData] = useState({
    recipient: "",
    amount: "",
    message: "",
    type: "instant",
  })

  const recentContacts = [
    { id: 1, name: "Ahmed Benali", phone: "+213 555 123 456", avatar: "AB" },
    { id: 2, name: "Fatima Khelil", phone: "+213 555 789 012", avatar: "FK" },
    { id: 3, name: "Yacine Meziani", phone: "+213 555 345 678", avatar: "YM" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("confirm")
  }

  const handleConfirm = () => {
    setStep("auth")
  }

  const handleAuth = () => {
    // Simulate biometric authentication
    setTimeout(() => {
      setStep("success")
    }, 2000)
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Virement Réussi !</h2>
            <p className="text-gray-600 mb-4">Votre virement de {transferData.amount} DZD a été envoyé avec succès.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Numéro de transaction</p>
              <p className="font-mono text-lg font-semibold">#TXN-2024-001234</p>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full">Retour au tableau de bord</Button>
              </Link>
              <Button variant="outline" className="w-full">
                Télécharger le reçu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "auth") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Authentification Requise</CardTitle>
            <CardDescription>Confirmez votre identité pour finaliser le virement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="animate-pulse mb-4">
                  <Fingerprint className="h-12 w-12 text-blue-600 mx-auto" />
                </div>
                <p className="text-blue-800 font-medium">Authentification biométrique</p>
                <p className="text-blue-600 text-sm">Placez votre doigt sur le capteur</p>
              </div>

              <Button onClick={handleAuth} className="w-full">
                Simuler l'authentification
              </Button>

              <Button variant="ghost" onClick={() => setStep("confirm")}>
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setStep("form")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Confirmer le Virement</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>Vérifiez les détails avant de confirmer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Destinataire</span>
                  <span className="font-medium">{transferData.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-medium text-lg">{transferData.amount} DZD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais</span>
                  <span className="font-medium">0 DZD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <Badge>{transferData.type === "instant" ? "Instantané" : "Programmé"}</Badge>
                </div>
                {transferData.message && (
                  <div>
                    <span className="text-gray-600">Message</span>
                    <p className="text-sm bg-gray-50 p-2 rounded mt-1">{transferData.message}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total à débiter</span>
                  <span>{transferData.amount} DZD</span>
                </div>
              </div>

              <Button onClick={handleConfirm} className="w-full">
                Confirmer le virement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Nouveau Virement</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Recent Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contacts Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                    onClick={() => setTransferData({ ...transferData, recipient: contact.phone })}
                  >
                    <Avatar>
                      <AvatarFallback>{contact.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du Virement</CardTitle>
              <CardDescription>Remplissez les informations du destinataire</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Destinataire</Label>
                  <Input
                    id="recipient"
                    placeholder="Numéro de téléphone ou email"
                    value={transferData.recipient}
                    onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (DZD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    required
                  />
                  <p className="text-sm text-gray-500">Solde disponible: 125,750.00 DZD</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type de virement</Label>
                  <Select
                    value={transferData.type}
                    onValueChange={(value) => setTransferData({ ...transferData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Instantané (gratuit)
                        </div>
                      </SelectItem>
                      <SelectItem value="scheduled">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Programmé
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (optionnel)</Label>
                  <Input
                    id="message"
                    placeholder="Ajouter un message..."
                    value={transferData.message}
                    onChange={(e) => setTransferData({ ...transferData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={!transferData.recipient || !transferData.amount}>
                  Continuer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
