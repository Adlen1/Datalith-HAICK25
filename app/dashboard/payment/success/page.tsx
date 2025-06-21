"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, Share, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
          <p className="text-gray-600 mb-6">
            Votre paiement a été effectué avec succès et le bénéficiaire a été notifié.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Numéro de transaction</span>
                <span className="font-mono font-semibold">#PAY-2024-001234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date et heure</span>
                <span>{new Date().toLocaleString("fr-FR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Statut</span>
                <span className="text-green-600 font-medium">Terminé</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-[#E2211C] hover:bg-[#C11E18]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au tableau de bord
              </Button>
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button variant="outline" className="flex-1">
                <Share className="mr-2 h-4 w-4" />
                Partager
              </Button>
            </div>

            <Link href="/dashboard/payment">
              <Button variant="ghost" className="w-full">
                Nouveau paiement
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
