"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Send, Clock, Edit, Repeat, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState({
    recipient: "",
    amount: "",
    message: "",
    type: "instant",
    accountNumber: "",
    saveForFuture: false,
  })
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const router = useRouter()

  const automatedTransactions = [
    {
      id: 1,
      name: "Loyer Appartement",
      category: "Logement",
      icon: "🏠",
      lastAmount: "45000",
      accountNumber: "001234567890",
      frequency: "Mensuel",
      lastPaid: "2024-01-01",
      nextDue: "2024-02-01",
      status: "active",
    },
    {
      id: 2,
      name: "Facture Électricité",
      category: "Utilities",
      icon: "⚡",
      lastAmount: "3200",
      accountNumber: "987654321012",
      frequency: "Mensuel",
      lastPaid: "2024-01-10",
      nextDue: "2024-02-10",
      status: "due",
    },
    {
      id: 3,
      name: "Courses Alimentaires",
      category: "Alimentation",
      icon: "🛒",
      lastAmount: "8500",
      accountNumber: "456789012345",
      frequency: "Hebdomadaire",
      lastPaid: "2024-01-12",
      nextDue: "2024-01-19",
      status: "active",
    },
    {
      id: 4,
      name: "Abonnement Internet",
      category: "Télécommunications",
      icon: "📡",
      lastAmount: "2800",
      accountNumber: "789012345678",
      frequency: "Mensuel",
      lastPaid: "2024-01-05",
      nextDue: "2024-02-05",
      status: "active",
    },
    {
      id: 5,
      name: "Assurance Auto",
      category: "Assurance",
      icon: "🚗",
      lastAmount: "12000",
      accountNumber: "234567890123",
      frequency: "Mensuel",
      lastPaid: "2024-01-15",
      nextDue: "2024-02-15",
      status: "active",
    },
    {
      id: 6,
      name: "Frais de Scolarité",
      category: "Éducation",
      icon: "🎓",
      lastAmount: "25000",
      accountNumber: "567890123456",
      frequency: "Trimestriel",
      lastPaid: "2024-01-01",
      nextDue: "2024-04-01",
      status: "active",
    },
  ]

  const handleQuickPay = (transaction: any) => {
    // Redirect to authentication page with transaction data
    const transactionData = {
      recipient: transaction.name,
      amount: transaction.lastAmount,
      accountNumber: transaction.accountNumber,
      message: `Paiement automatique - ${transaction.name}`,
      type: "instant",
    }

    // Store transaction data in sessionStorage for the auth page
    sessionStorage.setItem("pendingPayment", JSON.stringify(transactionData))
    router.push("/dashboard/payment/auth")
  }

  const handleModifyAndPay = (transaction: any) => {
    setSelectedTransaction(transaction)
    setPaymentData({
      recipient: transaction.name,
      amount: transaction.lastAmount,
      accountNumber: transaction.accountNumber,
      message: `Paiement - ${transaction.name}`,
      type: "instant",
      saveForFuture: false,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Store payment data for authentication
    sessionStorage.setItem("pendingPayment", JSON.stringify(paymentData))
    router.push("/dashboard/payment/auth")
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
            <h1 className="text-xl font-semibold">Paiements</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Automated Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="h-5 w-5" />
                Paiements Automatisés
              </CardTitle>
              <CardDescription>Vos paiements récurrents et factures habituelles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {automatedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      transaction.status === "due"
                        ? "border-orange-200 bg-orange-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{transaction.icon}</div>
                        <div>
                          <h3 className="font-medium text-gray-900">{transaction.name}</h3>
                          <p className="text-sm text-gray-500">{transaction.category}</p>
                        </div>
                      </div>
                      {transaction.status === "due" && (
                        <Badge variant="destructive" className="text-xs">
                          À payer
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dernier montant</span>
                        <span className="font-medium">{transaction.lastAmount} DZD</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fréquence</span>
                        <span>{transaction.frequency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prochain paiement</span>
                        <span>{transaction.nextDue}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleQuickPay(transaction)}
                        className="flex-1 bg-[#E2211C] hover:bg-[#C11E18]"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Payer maintenant
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModifyAndPay(transaction)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Manual Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Nouveau Paiement</CardTitle>
              <CardDescription>Effectuer un paiement manuel</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Bénéficiaire</Label>
                  <Input
                    id="recipient"
                    placeholder="Nom du bénéficiaire"
                    value={paymentData.recipient}
                    onChange={(e) => setPaymentData({ ...paymentData, recipient: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Numéro de compte</Label>
                  <Input
                    id="accountNumber"
                    placeholder="000000000000"
                    value={paymentData.accountNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                    required
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Montant (DZD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    required
                  />
                  <p className="text-sm text-gray-500">Solde disponible: 125,750.00 DZD</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type de paiement</Label>
                  <Select
                    value={paymentData.type}
                    onValueChange={(value) => setPaymentData({ ...paymentData, type: value })}
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
                    value={paymentData.message}
                    onChange={(e) => setPaymentData({ ...paymentData, message: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveForFuture"
                    checked={paymentData.saveForFuture}
                    onCheckedChange={(checked) => setPaymentData({ ...paymentData, saveForFuture: checked as boolean })}
                  />
                  <Label htmlFor="saveForFuture" className="text-sm">
                    Sauvegarder ce paiement pour les prochaines fois
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!paymentData.recipient || !paymentData.amount || !paymentData.accountNumber}
                >
                  Continuer vers l'authentification
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
